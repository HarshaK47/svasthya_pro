import React from 'react';

export default function Header(props) {
  return (
    <header className="block row center">
      <div>
        <a href="#/">
          <h1 style={{color:"#006400"}}
>Svasthya</h1>
        </a>
      </div>
      <div >
        <a href="#/cart" style={{color:"#006400"}}>
          Cart{' '}
          {props.countCartItems ? (
            <button className="badge">{props.countCartItems}</button>
          ) : (
            ''
          )}
        </a>{' '}
      </div>
    </header>
  );
}
