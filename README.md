# React Native in Depth (and a chat app)


## Required tools to be installed on your machine

- **Watchman** [Install Instructions](#install-watchman)
- **Node & NPM** [Install Instructions](#install-npm)
- **React Native Debugger** [Install Instructions](#install-react-native-debugger)
- **React Native CLI** [Install Instructions](#install-watchman)
- **JDK** [Install Instructions](#install-jdk)
- **XCode** [Install Instructions](#install-xcode)

Note: you don't technically need to have both the android and ios environments set up to develop
on this app, but it is encouraged to have both and to develop on both at the same time when writing
React Native code.


## Getting started

To get started, clone this project and navigate to the directory

```bash
git clone https://github.com/lelandrichardson/react-native-in-depth.git
cd react-native-in-depth
```

From here, you will need to run `npm install` once before running the app.



## Suggested IDEs

Feel free to work with whatever IDE you'd like. It's just JavaScript, so
any editor will work here. If you would like something that is made
specifically for these types of projects, check out one of the following:

- [VS Code](https://code.visualstudio.com/)
- [Nuclide (Atom)](https://nuclide.io/)



## Running and Developing

To start debugging the app, you can use the react-native CLI from the root of the project:

To run and debug on iOS:
```bash
react-native run-ios
```

To run and debug on Android:
```bash
react-native run-android
```


## Debugging

Open the React Native Debugger with `CMD + d` in the iOS emulator or `CMD + m` in the Android emulator.



## Additional Links

- [React Native Official Documentation](http://facebook.github.io/react-native/)
- [React Native Express](http://www.reactnativeexpress.com/)
- [Flexbox Froggy](http://flexboxfroggy.com/)
- [React Native Getting Started doc](http://facebook.github.io/react-native/docs/getting-started.html)





## Install NPM

Note: verify you don't already have this isntalled by running `node --version`. If it returns anything greater than 6, you're good.

You will want to have node and npm installed on your machine.

If you don't currently have nvm installed, you can install it with the following command:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
```

When that is done, run:

```bash
nvm install node
```

You should be ready to go!


## Install Watchman

Note: verify you don't already have this isntalled by running `which watchman`.

```bash
brew install watchman
```

## Install React Native Debugger

```bash
brew update && brew cask install react-native-debugger
```

## Install React Native CLI

Note: verify you don't already have this isntalled by running `which react-native`.

```bash
npm i -g react-native-cli
```

## Install JDK

Note: verify you don't already have this isntalled by running `echo $ANDROID_HOME`.

Download and isntall [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

You'll also probably want to follow the instructions laid out [here](http://facebook.github.io/react-native/docs/getting-started.html#android-development-environment)


## Install XCode

Install XCode from the Mac App store if you do not have it.
