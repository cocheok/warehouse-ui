import React, { useState } from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';


import { ItemCount } from '../ItemCount/ItemCount'

function ItemListContainer() {
 
  const [products, setProducts] = React.useState([]);
  
  React.useEffect(() => {
    fetch('http://localhost:6060/product')
      .then(results => results.json())
      .then(data => {
        setProducts(data)
      });
  }, []); // <-- Have to pass in [] here!




  const sellProduct = async (productId, count) => {

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    return fetch(`http://localhost:6060/product/${productId}/sell`, {
        method: 'post',
        body: { qty: count }
    });

  }


  const onAdd = async (productId, count) => {
    
    let newProductsState = [...products]
    const myProduct = products.find( (prod) => prod._id === productId );
    if(myProduct && myProduct.qty >= count){
      try {
        let res = await sellProduct(productId, count).then( res => {
          newProductsState[productId].stock -= count
          return setProducts(newProductsState)
        });
        alert(res);
      } catch (e) {
        alert(e);
      }
      
    } else {
      alert('Error')
    }
    
  }

  return (
    <div className="item-list">
      { products.map( (product) => 
      <Card key={product._id}>
        <CardHeader
       
        avatar={
          <Avatar sx={{ bgcolor: red[500], fontSize: 14 }} aria-label="recipe">
            {`€ `}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={product.name}
        subheader={`Available units: ${product.qty}`}
      />
    
      <CardActions>
        <ItemCount itemId={product._id} stock={product.qty} initial={0} onAdd={onAdd} />
      </CardActions>
       
      </Card>
       
      
      )} 
    </div>
  )
}

export default ItemListContainer