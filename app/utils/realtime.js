import React from 'react';
import { graphql } from 'react-apollo';
import oneAtATime from './oneAtATime';

const getSubscriptionOptions = (options, props) => {
  if (options && options.options) {
    if (typeof options.options === 'function') {
      return options.options(props) || {};
    }
    return options.options;
  }
  return {};
};

const realtime = (options) => Component => {
  const {
    loadQuery,
    loadMoreQuery,
    subscriptionQuery,
    name,
    queryName,
    subscriptionName,
    pageSize,
    mergeSubscription,
    mergeMore,
    ...rest
  } = options;

  const finalOptions = {
    ...rest,
    props: props => ({
      ...props.ownProps,
      [name]: props.data,
      loadMore: oneAtATime((done) => {
        const data = props.data[queryName];
        props.data.fetchMore({
          query: loadMoreQuery,
          variables: {
            roomId: props.ownProps.id, // TODO
            pageSize,
            after: data[data.length - 1].id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            done();
            if (!fetchMoreResult) {
              return prev;
            }
            return {
              ...prev,
              [queryName]: mergeMore(prev[queryName], fetchMoreResult[queryName]),
            };
          },
        });
      }),
    }),
  };

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
              [queryName]: mergeSubscription(previousState[queryName], newEntry),
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

  return graphql(loadQuery, finalOptions)(Realtime);
};

module.exports = realtime;
