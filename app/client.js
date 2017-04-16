// eslint-disable-next-line import/no-named-as-default
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/rnchat');

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
