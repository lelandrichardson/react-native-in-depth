import React from 'react';
import { graphql } from 'react-apollo';

const getSubscriptionOptions = (options, props) => {
  if (options && options.options) {
    if (typeof options.options === 'function') {
      return options.options(props) || {};
    }
    return options.options;
  }
  return {};
};

const realtime = (loadQuery, subscriptionQuery, options) => Component => {
  const { name, queryName, subscriptionName } = options;
  class Realtime extends React.Component {
    componentWillReceiveProps(nextProps) {
      if (!nextProps[name].loading) {
        if (this.subscription) {
          if (nextProps[name][queryName] !== this.props[name][queryName]) {
            // if the feed has changed, we need to unsubscribe before resubscribing
            this.subscription();
          } else {
            // we already have an active subscription with the right params
            return;
          }
        }
        this.subscription = nextProps[name].subscribeToMore({
          document: subscriptionQuery,
          variables: null,
          ...getSubscriptionOptions(options, nextProps),

          // this is where the magic happens.
          updateQuery: (previousState, { subscriptionData }) => {
            const newEntry = subscriptionData.data[subscriptionName].node;
            return {
              ...previousState,
              [queryName]: options.append(previousState[queryName], newEntry),
            };
          },
          onError: (err) => console.log('subscription error', err),
        });
      }
    }
    render() {
      return <Component {...this.props} />;
    }
  }

  Realtime.displayName = `Realtime(${Component.displayName || Component.name})`;

  return graphql(loadQuery, options)(Realtime);
};

module.exports = realtime;
