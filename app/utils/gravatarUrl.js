import { PixelRatio } from 'react-native';
import md5 from 'md5';

function gravatarUrl(email, size) {
  if (!email) return null;
  const s = Math.round(PixelRatio.get() * size);
  return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}.png?s=${s}&d=retro`;
}

module.exports = gravatarUrl;
