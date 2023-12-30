import './App.css';
import Header from './Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Protected from './Protected';
import Profile from './Profile';
import ListProducts from './listPage';
import ProductPageDetail from './detailProduct';
import ShoppingCharts from './shoppingChart';
import PaymentPages from './paymentPage';
import PaymentDetails from './paymentDetail';
import AddProducts from './addProduct';
import EditProduct from './editProduct';
import DetailSellerPage from './detailSeller';
import UpdateUserData from './updateProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {/* <Route path='/profile' element={<Protected  Cmp={Profile} />} /> */}
          <Route path='/listproducts' element={<ListProducts />} />
          <Route path='/fetchProducts/:id' element={<ProductPageDetail />} />
          <Route path='/keranjang' element={<Protected  Cmp={ShoppingCharts} />} />
          <Route path='/payment' element={<PaymentPages />} />
          <Route path='/payment/:id' element={<PaymentDetails />} />
          <Route path='/addProduct' element={<AddProducts />} />
          <Route path='/editProduct/:id' element={<EditProduct />} />
          <Route path='/detailSeller' element={<DetailSellerPage />} />
          <Route path='/updateUser' element={<UpdateUserData />} />

        </Routes>
      </BrowserRouter>
  
    </div>
  );
}

export default App;
