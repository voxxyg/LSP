import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Protected from './Protected';
import ListProducts from './listPage';
import ProductPageDetail from './detailProduct';
import PaymentPages from './paymentPage';
import PaymentDetails from './paymentDetail';
import AddProducts from './addProduct';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listproducts' element={<ListProducts />} />
          <Route path='/fetchProducts/:id' element={<ProductPageDetail />} />
          <Route path='/payment' element={<PaymentPages />} />
          <Route path='/payment/:id' element={<PaymentDetails />} />
          <Route path='/addProduct' element={<AddProducts />} />

        </Routes>
      </BrowserRouter>
  
    </div>
  );
}

export default App;
