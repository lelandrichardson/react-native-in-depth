const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MS_IN_DAY = 86400;

module.exports = function timeAgo(date) {
  const seconds = Math.floor((+new Date() - date.getTime()) / 1e3);
  const minutes = Math.floor(seconds / 60);
  const days = Math.floor(seconds / MS_IN_DAY);

  return (
    (seconds < 15 && ['now']) ||
    (seconds < 60 && [seconds, 's ago']) ||
    (seconds < 3600 && [minutes, 'm ago']) ||
    (days < 1 && [Math.floor(minutes / 60), 'h ago']) ||
    (days < 30 && [days, 'd ago']) ||
    (days < 365 && [MONTHS[date.getMonth()], ' ', date.getDate()]) ||
    [Math.floor(days / 365), 'y ago']
  ).join('');
};
