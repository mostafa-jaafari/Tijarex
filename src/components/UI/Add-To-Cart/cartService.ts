// /lib/cartService.ts

// Define the shape of a single item in the cart.
// A unique ID is added to handle cases where the same product
// is added with different options (e.g., Red-L and Blue-M).
export interface CartItem {
  id: string; // A unique identifier for this specific line item (e.g., 'product123-red-large')
  productId: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  // You can add other properties here later, like price, image, etc.
}

// Use a constant for the storage key to prevent typos
const CART_KEY = 'shoppingCart';

/**
 * A synchronous helper to safely get the cart from localStorage.
 * @returns {CartItem[]} The current array of cart items.
 */
export function getCart(): CartItem[] {
  // This check is crucial for Next.js to prevent errors during server-side rendering
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return []; // Return an empty array if the stored data is corrupted
  }
}

/**
 * Asynchronously adds a product to the cart or increments its quantity if it already exists
 * with the exact same options (color and size).
 * @param {string} productId - The ID of the product to add.
 * @param {number} quantity - The quantity to add.
 * @param {object} [options] - Optional product variants like color and size.
 * @returns {Promise<void>}
 */
export async function addProductToCart(
  productId: string,
  quantity: number,
  options?: { color?: string | null; size?: string | null }
): Promise<void> {
  return new Promise((resolve) => {
    const cart = getCart();
    
    // Create a unique ID for this specific item configuration
    const itemID = `${productId}-${options?.color || ''}-${options?.size || ''}`;

    const existingProductIndex = cart.findIndex(item => item.id === itemID);

    if (existingProductIndex > -1) {
      // --- THIS IS THE FIX ---
      // If product with same options exists, update its quantity
      // The variable is 'existingProductIndex', not 'existingProduct-Index'
      cart[existingProductIndex].quantity += quantity;
    } else {
      // If not, add it as a new line item in the cart
      cart.push({
        id: itemID,
        productId,
        quantity,
        color: options?.color,
        size: options?.size,
      });
    }

    const updatedCartJSON = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, updatedCartJSON);

    // Manually dispatch a storage event. This is the key to making the hook
    // update in the *same tab* where the change was made.
    window.dispatchEvent(new StorageEvent('storage', {
      key: CART_KEY,
      newValue: updatedCartJSON,
    }));

    resolve();
  });
}

/**
 * Asynchronously removes an item completely from the cart using its unique ID.
 * @param {string} itemId - The unique ID of the cart item to remove (e.g., 'product123-red-large').
 * @returns {Promise<void>}
 */
export async function removeProductFromCart(itemId: string): Promise<void> {
  return new Promise((resolve) => {
    const cart = getCart();
    // Filter the cart to create a new array without the item that has the matching ID
    const updatedCart = cart.filter(item => item.id !== itemId);
    
    const updatedCartJSON = JSON.stringify(updatedCart);
    localStorage.setItem(CART_KEY, updatedCartJSON);

    // Dispatch the event so the UI updates in realtime
    window.dispatchEvent(new StorageEvent('storage', {
      key: CART_KEY,
      newValue: updatedCartJSON,
    }));

    resolve();
  });
}