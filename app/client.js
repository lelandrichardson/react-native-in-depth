// eslint-disable-next-line import/no-named-as-default
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

// we do a little bit of patchwork with the SubscriptionClient to make it a little more robust
SubscriptionClient.prototype.connect = (original => function connect() {
  // eslint-disable-next-line prefer-rest-params
  original.apply(this, arguments);

  // this.client has an onmessage method which has a habbit of throwing errors when debugging
  // and live reloading etc. Let's just go ahead and wrap it and safely call it instead.
  const originalOnMessage = this.client.onmessage;
  this.client.onmessage = function onmessage() {
    try {
      // eslint-disable-next-line prefer-rest-params
      return originalOnMessage.apply(this, arguments);
    } catch (e) {
      // swallow all errors for now. might want to make stricter in the future
      console.log('WebSocket Client Error!', e);
      return null;
    }
  };
})(SubscriptionClient.prototype.connect);

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/rnchat', {
  reconnect: true,
});

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/rnchat',
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

module.exports = client;
