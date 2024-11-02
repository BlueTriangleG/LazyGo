# Welcome to Lazy Go

## Code structure:

- app: Store all app pages design.
  - (api) store server action api
  - (auth) store authtication pages and instruction pages
  - (root) store the main pages
    - (generate-plan) Store pages about plan generation.
    - (tabs) Store pages in the main page.
- assets: Store pictures and icons
- components: Store reuseable components, functions.
- constants: Store constants.
- lib: Store server actions.

## Technique usage

- Code language: typescript
- Framework: expo reac native
- CSS: tailwind
- Authentication: clerk
- Database: Neon + postgres
- AI technique: ChatGPT
  - The activities of the plan is generated step by step, making sure that the start position of each activity is the position of the previous activity. 
  - Generate plan based on the following data: ```Details of nearby places with specific types or keywords, history of recommendation (prevent the generated plan from remaining unchanged), distances between the current position to nearby places, generated plan (avoid duplicated places in one plan)```.
  - GPT can choose destinations based on the distance, price level, ratings and make a brief plan to the user.


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a .env file with content:

   ```bash
   # Need to fill these values
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
   EXPO_PUBLIC_GOOGLE_MAP_API_KEY=
   EXPO_PUBLIC_GPT_KEY=
   EXPO_PUBLIC_DATABASE_URL=
   EXPO_PUBLIC_SERVER_URL=https://lazygo.com/
   EXPO_PUBLIC_WETHER_API_KEY=
   ```

3. Start the app

   ```bash
   # Do add the flag "--go"
   npx expo start --go
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Preview
![b34222cbebd60f3d0faaa10d7387a67](https://github.com/user-attachments/assets/144a7677-59d4-4a15-87b8-60c9e6d75805)
