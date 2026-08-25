import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import './index.css';
import App from './components/App';

// Redux
import store from './store';

const queryClient = new QueryClient({});
const root = createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <App />
        </Provider>
    </QueryClientProvider>
);
