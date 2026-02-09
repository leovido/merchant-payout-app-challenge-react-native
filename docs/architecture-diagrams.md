# Architecture Diagrams — Coding Defense Support

Mermaid diagrams to explain data flow, module boundaries, and key flows during your challenge evaluation.

---

## 1. Data Flow: API → Store → Features → UI

How data moves from the backend (MSW) through the app to the screen.

```mermaid
flowchart LR
    subgraph external [External]
        MSW[MSW Mock API]
    end

    subgraph apiLayer [API Layer]
        apiSlice[apiSlice.ts]
    end

    subgraph store [Redux Store]
        apiReducer[api reducer]
        balanceReducer[balance reducer]
        activityReducer[activity reducer]
        payoutReducer[payout reducer]
    end

    subgraph features [Features]
        BalanceSection[BalanceSection]
        ActivitySection[ActivitySection]
        PayoutScreen[PayoutScreen]
        payoutsRoute[payouts.tsx route]
    end

    subgraph ui [UI]
        BalanceSectionUI[BalanceSection.Title etc]
        ActivitySectionUI[ActivitySection.List etc]
        PayoutScreenUI[PayoutScreen.AmountTextField etc]
    end

    MSW --> apiSlice
    apiSlice --> apiReducer
    apiSlice --> balanceReducer
    apiSlice --> activityReducer
    payoutReducer --> apiSlice
    apiSlice --> MSW

    balanceReducer --> BalanceSection
    activityReducer --> ActivitySection
    payoutReducer --> PayoutScreen
    payoutReducer --> payoutsRoute
    apiReducer --> BalanceSection
    apiReducer --> ActivitySection
    apiReducer --> payoutsRoute

    BalanceSection --> BalanceSectionUI
    ActivitySection --> ActivitySectionUI
    PayoutScreen --> PayoutScreenUI
    payoutsRoute --> PayoutScreen
```

**Read flow:** MSW → apiSlice (RTK Query) → store (cache in `api`, client state in `balance`/`activity`/`payout`) → feature components → compound UI. **Write flow:** User action in UI → dispatch to slice or mutation → apiSlice → MSW.

---

## 2. Module Boundaries and Dependencies

What each area owns and what it is allowed to depend on.

```mermaid
flowchart TB
    subgraph app [app]
        appLayout[_layout.tsx]
        tabsIndex[index.tsx]
        tabsPayouts[payouts.tsx]
    end

    subgraph features [features]
        activity[activity]
        balances[balances]
        payout[payout]
    end

    subgraph shared [Shared]
        api[api]
        store[store]
        components[components]
        constants[constants]
        hooks[hooks]
        types[types]
        utils[utils]
    end

    subgraph native [Native Bridge]
        screenSecurity[screen-security]
    end

    appLayout --> store
    appLayout --> components
    tabsIndex --> features
    tabsPayouts --> features
    tabsPayouts --> api

    activity --> api
    activity --> store
    activity --> components
    activity --> types
    balances --> api
    balances --> store
    balances --> components
    balances --> types
    payout --> api
    payout --> store
    payout --> components
    payout --> types
    payout --> utils
    payout --> screenSecurity

    api --> constants
    api --> types
    store --> api
    store --> features
    components --> constants
    features --> hooks
```

**Rule of thumb:** `app` wires and composes; `features` depend on `api`, `store`, `components`, `types` (and `utils`/`hooks` where needed). Shared code does not import from features. `screen-security` is only used by the payout feature (and tests via mocks).

---

## 3. State Ownership: What Lives Where

Clarifies server state vs client state for the “why RTK Query + slices” discussion.

```mermaid
flowchart TB
    subgraph serverState [Server state - RTK Query cache]
        cacheBalance[Balance from GET merchant]
        cacheActivity[Paginated activity]
        cachePayoutResult[Payout response after POST]
    end

    subgraph clientState [Client state - Redux slices]
        balanceSlice[balanceSlice - minimal]
        activitySlice[activitySlice - initial activity]
        payoutSlice[payoutSlice - form, device_id, response, error]
    end

    subgraph localState [Local component state]
        modalVisible[isModalVisible in payouts.tsx]
        cursorPaginate[Pagination cursor in ActivityModal]
    end

    cacheBalance --> BalanceSection
    cacheActivity --> ActivitySection
    cacheActivity --> ActivityModal
    payoutSlice --> payoutsRoute
    payoutSlice --> PayoutScreen
    modalVisible --> payoutsRoute
    cachePayoutResult --> payoutSlice
```

**Talking point:** "Server state lives in RTK Query cache; we don’t duplicate it in slices. Slices hold form data, UI-derived state, and post-submission result/error. Local state is for things that don’t need to be shared or persisted, like modal open/close."

---

## 4. Payout Flow Sequence (Critical Path)

End-to-end flow from user confirm to success/failure. Use this to defend the payout implementation.

```mermaid
sequenceDiagram
    participant User
    participant PayoutsRoute as payouts.tsx
    participant PayoutScreen as PayoutScreen
    participant Slice as payoutSlice
    participant Api as apiSlice
    participant Native as screen-security
    participant MSW as MSW API

    User->>PayoutScreen: Fill amount, currency, IBAN
    PayoutScreen->>Slice: setPayout (form updates)
    Native->>PayoutScreen: getDeviceId
    PayoutScreen->>Slice: setDeviceId
    User->>PayoutsRoute: Confirm in modal
    PayoutsRoute->>PayoutsRoute: onPressCreatePayout
    PayoutsRoute->>Api: useCreatePayoutMutation with amount, currency, iban, device_id
    Api->>MSW: POST /api/payouts
    alt Success
        MSW-->>Api: PayoutResponse
        Api-->>PayoutsRoute: response.data
        PayoutsRoute->>Slice: setPayoutResponse
        PayoutsRoute->>User: PayoutStatusCompletedScreen
    else Error 4xx or 5xx
        MSW-->>Api: error + body
        Api-->>PayoutsRoute: response.error
        PayoutsRoute->>Slice: setFailurePayoutState
        PayoutsRoute->>User: PayoutStatusFailedScreen
    else Network error
        Api-->>PayoutsRoute: throw / catch
        PayoutsRoute->>Slice: setFailurePayoutState
        PayoutsRoute->>User: PayoutStatusFailedScreen
    end
```

**Talking point:** "Route owns the mutation call and error handling; it reads from the payout slice and dispatches result or failure into the slice so the status screens can render from the same state."

---

## 5. Feature Internal Structure (Payout Example)

How one feature is structured: slice, context, compound components, and route.

```mermaid
flowchart TB
    subgraph route [Route - app slash tabs slash payouts.tsx]
        useMutation[useCreatePayoutMutation]
        useSelector[useSelector payout]
        onPressCreatePayout[onPressCreatePayout]
        onPressTryAgain[onPressCreateAnotherPayout]
    end

    subgraph payoutFeature [features slash payout]
        payoutSlice[payoutSlice]
        PayoutContext[PayoutContext]
        PayoutScreen[PayoutScreen container]
        PayoutScreenTitle[PayoutScreen.Title]
        PayoutScreenAmount[PayoutScreen.AmountTextField]
        PayoutScreenCurrency[PayoutScreen.CurrencyDropdown]
        PayoutScreenIBAN[PayoutScreen.IBANTextField]
        PayoutScreenConfirm[PayoutScreen.ConfirmButton]
        PayoutScreenModal[PayoutScreen.PayoutModal]
        PayoutModalContent[PayoutModalContent]
        StatusCompleted[PayoutStatusCompletedScreen]
        StatusFailed[PayoutStatusFailedScreen]
    end

    route --> useMutation
    route --> payoutSlice
    route --> PayoutScreen
    route --> StatusCompleted
    route --> StatusFailed
    onPressCreatePayout --> useMutation
    onPressCreatePayout --> payoutSlice
    payoutSlice --> PayoutContext
    PayoutScreen --> PayoutContext
    PayoutContext --> PayoutScreenTitle
    PayoutContext --> PayoutScreenAmount
    PayoutContext --> PayoutScreenCurrency
    PayoutContext --> PayoutScreenIBAN
    PayoutContext --> PayoutScreenConfirm
    PayoutContext --> PayoutScreenModal
    PayoutScreenModal --> PayoutModalContent
```

**Talking point:** "The route is the only place that calls the mutation and handles try-again / create-another. The feature owns the slice and the compound component tree; the context connects the slice to the compound children so we avoid prop drilling and keep a clear public API."

---

## 6. Activity Pagination and Cache Merge

How cursor-based pagination and RTK Query merge work together.

```mermaid
flowchart LR
    subgraph firstPage [First request]
        A1[getPaginatedActivity limit 15 cursor empty]
        A2[GET slash api slash merchant slash activity]
    end

    subgraph cache [RTK Query cache]
        C[Single cache entry by serializeQueryArgs]
        merge[Merge: existing items plus new items]
    end

    subgraph nextPage [Next request]
        B1[getPaginatedActivity limit 15 cursor next_cursor]
        B2[GET slash api slash merchant slash activity with cursor]
    end

    A1 --> A2
    A2 --> C
    C --> merge
    B1 --> B2
    B2 --> merge
    merge --> C
```

**Talking point:** "We use a stable cache key so all pages share one cache entry. The merge function appends new items to the existing list and updates next_cursor and has_more. That gives the modal one growing list for infinite scroll without managing pagination state in a slice."

---

## 7. Testing Strategy Layers

What is tested at which layer; useful to explain test choices.

```mermaid
flowchart TB
    subgraph unit [Unit]
        sliceTests[Slice tests - activitySlice, balanceSlice, payoutSlice]
        utilTests[Utils tests - dateFormatter, formatter]
    end

    subgraph component [Component]
        balanceSectionTest[BalanceSection.test]
        activitySectionTest[ActivitySection.test]
        activityModalTest[ActivityModal.test]
    end

    subgraph integration [Integration]
        payoutsTest[payouts.test - device_id in request, API mock]
    end

    subgraph mocks [Mocks]
        screenSecurityMock[__mocks__ slash screen-security]
        apiSliceMock[Mock useCreatePayoutMutation in payouts.test]
    end

    unit --> sliceTests
    unit --> utilTests
    component --> balanceSectionTest
    component --> activitySectionTest
    component --> activityModalTest
    integration --> payoutsTest
    payoutsTest --> screenSecurityMock
    payoutsTest --> apiSliceMock
```

**Talking point:** "We test slices and utils in isolation, feature components with RTL and real or mocked hooks, and the payout flow with the API and native module mocked so we can assert device_id and error handling without hitting real native or network."

---

## 8. Native Module Boundary

How the JS app uses the ScreenSecurity module and how tests replace it.

```mermaid
flowchart LR
    subgraph app [App]
        PayoutScreen[PayoutScreen]
        getDeviceId[getDeviceId from screen-security]
    end

    subgraph screenSecurity [screen-security]
        indexTs[index.ts]
        ScreenSecurityModule[ScreenSecurityModule.ts]
        nativeBridge[Native bridge]
    end

    subgraph native [Native]
        ios[iOS ScreenSecurityModule]
        android[Android ScreenSecurityModule]
    end

    subgraph tests [Tests]
        screenSecurityMock[__mocks__ slash screen-security.js]
        globalGetDeviceId[globalThis.__screenSecurityGetDeviceId]
    end

    PayoutScreen --> getDeviceId
    getDeviceId --> indexTs
    indexTs --> ScreenSecurityModule
    ScreenSecurityModule --> nativeBridge
    nativeBridge --> ios
    nativeBridge --> android
    screenSecurityMock --> globalGetDeviceId
```

**Talking point:** "The app only imports the public JS API. The native module lives in screen-security and is required via Expo’s requireNativeModule. In tests we mock the module and control the return value so we can assert device_id in the payout request without running on a device."

---

## How to Use These in the Interview

1. **Data flow (diagram 1):** Use when they ask how data gets from the API to the UI or how you structured state.
2. **Module boundaries (diagram 2):** Use when they ask about folder structure or “why this dependency.”
3. **State ownership (diagram 3):** Use when they ask why you use both RTK Query and Redux slices.
4. **Payout sequence (diagram 4):** Use when they drill into the payout flow or error handling.
5. **Feature structure (diagram 5):** Use when they ask how a feature is organized (slice + context + compound components).
6. **Activity pagination (diagram 6):** Use when they ask about infinite scroll or cursor pagination.
7. **Testing (diagram 7):** Use when they ask how you test or what you mock.
8. **Native module (diagram 8):** Use when they ask about the device ID or native bridge and testability.

You can keep this file open or export the Mermaid to images and add them to a one-pager for quick reference during the evaluation.
