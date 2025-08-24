# Frontend (React/Next.js)
> ***The things you touch all the time when building UIs:***

## 1. State ( useState, useReducer)
- Keep track of what's changing on screen (form inputs, toggles, counters).
- Example:
```tsx
const [email, setEmail] = useState('');
```

![useState](https://i.imgur.com/1JZJZJZ.png)

## 2. Effects (useEffect)
Side effects: fetch data, subscribe to events, clean up
- Example: fetch API when component mounts
```tsx
useEffect(() => {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => setData(data));
}, []);
```

![useEffect](https://i.imgur.com/1JZJZJZ.png)

## 3. Forms (useForm, controlled inputs)
- Handling inputs and validation
- Example:
```tsx
const { register, handleSubmit, formState: { errors } } = useForm();
```

![useForm](https://i.imgur.com/1JZJZJZ.png)

## 4. Routing/Pages (useRouter)
- File system based routing, dynamic params, API routes
- Example:
```tsx
const router = useRouter();
router.push('/about');
```

![useRouter](https://i.imgur.com/1JZJZJZ.png)

## 5. Context/Props
- Passing data down trees (props) or globally (useContext)
- Example:
```tsx
const { user } = useContext(AuthContext);
```

![useContext](https://i.imgur.com/1JZJZJZ.png)

## In Short:

State --> Effect --> Form --> Routing --> Props/Context
