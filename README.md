# Welcome to Lazy Go

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a .env file with content:

```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZW1lcmdpbmctdG91Y2FuLTc4LmNsZXJrLmFjY291bnRzLmRldiQ
```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Code structure:

- app: Store all app pages design.
  - (api) store server action api
  - (auth) store authtication pages and instruction pages
  - (root) store the main pages
- assets: Store pictures and icons
- components: Store reuseable components, functions.
- constants: Store constants.
- lib: Store server actions.

## Technique usage

Code language: typescript
Framework: expo reac native
CSS: tailwind
Authentication: clerk
Database: Neon + postgres
