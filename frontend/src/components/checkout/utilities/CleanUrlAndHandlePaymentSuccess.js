import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserTokens } from 'thunks';

const CleanUrlAndHandlePaymentSuccess = ({ onGetUserTokens, userId, children }) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentSuccess = params.get('payment');
    
    if (paymentSuccess === 'success' && userId) {
      onGetUserTokens(userId);
    }

    if (paymentSuccess) {
      params.delete('payment');
      params.delete('payment_intent');
      params.delete('payment_intent_client_secret');
      params.delete('redirect_status');
      window.history.replaceState(null, '', '?' + params.toString());
    }
  }, [location.search, onGetUserTokens, userId]);

  return <>{children}</>;
};

const mapStateToProps = (state) => ({
  userId: state.user.currentUser?.user?.id, 
});

const mapDispatchToProps = (dispatch) => ({
  onGetUserTokens: (userId) => dispatch(getUserTokens(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CleanUrlAndHandlePaymentSuccess);
