import './scss/style.scss';
import './img/image1.jpg';

console.log('Hello world!');

const functionTest = () => {
    return [1, "string", true];
  }
  
  const [a, b, c] = functionTest();
  
  console.log(a);
  console.log(b);
  console.log(c)