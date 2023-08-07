import React, { useEffect, useState } from "react";
import "../styles/PlansScreen.css";
import db from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    async function getQuerySnap(){

      const q = query(collection(db, "customers", user.uid, "subscriptions"), where('cancel_at', '==', null))
      
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(async (subscription) => {
        setSubscription({
          role: subscription.data().items[0].price.product.metadata.planRole,

          current_period_end: subscription.data().current_period_end.seconds,

          current_period_start: subscription.data().current_period_start.seconds
        })
      })

      
    }
    getQuerySnap()
  },[user.uid])

  console.log(subscription)

  useEffect(() => {
    async function getDocSnap() {
      const q = query(collection(db, "products"), where("active", "==", true));
      const querySnapshot = await getDocs(q);

      const products = {};
      querySnapshot.forEach(async (doc) => {
        products[doc.id] = doc.data();
        const p = query(
          collection(doc.ref, "prices"),
          where("active", "==", true)
        );

        const priceSnap = await getDocs(p);

        priceSnap.docs.forEach((price) => {
          products[doc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });

      setProducts(products);
    }

    getDocSnap();
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = doc(db, "customers", user.uid);

    const colRef = collection(docRef, "checkout_sessions");

    const checkoutDoc = addDoc(colRef, {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    const checkoutRef = doc(db, 'customers', user.uid, 'checkout_sessions', (await checkoutDoc).id )

    onSnapshot(checkoutRef, async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        //show an error to your customer and
        //inspect your cloud function logs in the firebase console
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        //we have a session, lets redirect to checkout
        //init stripe

        const stripe = await loadStripe(
          "pk_test_51NcBQLCaloASnMLg2NWbS4dTcR9gCrZyph5miX2Eqyc2HIponuiWh5FcXiXOqS2WQkfHhUI7V5FYS4wluU6hveLA00eWmzlE4H"
        );

        stripe.redirectToCheckout({sessionId});
      }
    });
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription && <p>Renewal date:{ new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
      {Object.entries(products).map(([productId, productData]) => {
        //todo: add logic to check if the user's sub is active

        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);

        return (
          <div key={productId}
          className={`${
            isCurrentPackage && "plansScreen__plan--disabled"
          } plansScreen__plan`}>
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
