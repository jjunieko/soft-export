import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


test('renders App component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Product Registration/i);
  expect(linkElement).toBeInTheDocument();
});

const { getProducts } = require('/product');

jest.mock('axios');

test('fetches products from the API', async () => {
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ];

  axios.get.mockResolvedValueOnce({ data: products });

  const response = await getProducts();

  expect(response).toEqual(products);
  expect(axios.get).toHaveBeenCalledWith('/product');
});

