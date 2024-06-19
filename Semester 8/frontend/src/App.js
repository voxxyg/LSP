import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Protected from './Protected';
import ListProducts from './listPage';
import SlipGaji from './detailProduct';
import PaymentPages from './paymentPage';
import PaymentDetails from './paymentDetail';
import AddProducts from './addProduct';
import AddLaporan from './addLaporan';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listproducts/:bulan' element={<ListProducts />} />
          <Route path='/fetchProducts/:nip' element={<SlipGaji />} />
          <Route path='/payment' element={<PaymentPages />} />
          <Route path='/payment/:id' element={<PaymentDetails />} />
          <Route path='/addProduct' element={<AddProducts />} />
          <Route path='/addLaporan' element={<AddLaporan />} />

        </Routes>
      </BrowserRouter>
  
    </div>
  );
}

export default App;
