import { getFruits } from "./storage.js";

async function main() {
  const fruits = await getFruits();

  const tableFruitsDiv = document.getElementById("table-fruits");
  const cartSpan = document.getElementById("cart-Span");
  const cartItems = new Map(); // uma estrutura de dados para armazenar uma chave um valor

  for (const fruit of fruits) {
    //pega cada fruta da lista de frutas
    const fruitCardDiv = document.createElement("div"); // cria uma div nova
    fruitCardDiv.className = "fruit-card";
    if (fruit.name === "Cereja") {
      fruitCardDiv.classList.add("card-cereja");
    }
    //dentro do HTML retorna propriedades de cada objeto
    fruitCardDiv.innerHTML = ` 
      <p>${fruit.emoji}</p>
      <p>${fruit.name}</p>
      <p> R$ ${fruit.price.toFixed(2)}</p>
      <button class="btn-add-cart" data-name="${fruit.name}" data-emoji="${
      // cria um botão e armazena as propriedades dos objetos dentro desse botão
      fruit.emoji
    }" data-price="${fruit.price}" >Adicionar ao carrinho</button>
    `;

    tableFruitsDiv.appendChild(fruitCardDiv); //a div de cada objeto fruta deve estar dentro da div tabela de frutas (filho e pai)
  }
  // seleciona todos botões com a class .btn-add-cart e coloca dentro de uma lista
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    // adiciona o evento de click para a lista de botões
    btn.addEventListener("click", (event) => {
      //quando clicado, o botão clicado pega o valor data de cada propriedade definida do objeto dentro desse botão que foi clicado
      const fruit = {
        name: event.target.dataset.name,
        emoji: event.target.dataset.emoji,
        //parseFloat altera string para float
        price: parseFloat(event.target.dataset.price),
      };

      //se cartItens já tem o nome da fruta como true
      if (cartItems.has(fruit.name)) {
        //false: deve adicionar +1 e atualizar a quantidade de nome de fruta
        cartItems.set(fruit.name, cartItems.get(fruit.name) + 1);
      } else {
        //true: deve deixar o valor de nome como 1 para que seja adicionado
        cartItems.set(fruit.name, 1);
      }

      //inicia a função cardDisplay
      updateCartDisplay();
    });
  });

  //função chamada
  function updateCartDisplay() {
    //dentro de carrinho deve estar vázio
    cartSpan.innerHTML = "";
    //variavel para total de todas as frutas
    let totalPrice = 0;

    //usa o forEach para percorrer toda a lista de cartItens e usamos os parametros de valor de quantidade e nome das frutas
    cartItems.forEach((qtdFruit, fruitName) => {
      //faz uma busca de nomes iguais dentro de fruits e retorna para a váriavel fruit
      const fruit = fruits.find((f) => f.name === fruitName);
      if (fruit) {
        //pega a quantidade da fruta e múltiplica pelo preço definido pelo objeto e retorna para price o resultado
        let price = fruit.price * qtdFruit;
        //verifica se tem promoção
        if (fruit.discount) {
          //busca o valor de amount e value
          const fruitAmount = fruit.discount.amount;
          const fruitValue = fruit.discount.value;
          // ex: maçã qtd 10 / amount 5 = 2
          const multiples = Math.floor(qtdFruit / fruitAmount);
          if (multiples) {
            // 2 * 10 = 20 reais de desconto, menos o price para o subtotal
            price -= multiples * fruitValue;
          }
        }
        //o resultado de price é somado de todos os objetos para obter o total de todo o carrinho
        totalPrice += price;
        //no HTML cria uma nova linha para cada objeto adicionado no carrinho
        cartSpan.innerHTML += `${fruitName} ${
          fruit.emoji
        } - Preço: ${fruit.price.toFixed(
          2
        )} (Qtd: ${qtdFruit}) - Subtotal: ${price.toFixed(2)}/ A cada ${
          fruit.discount.amount
        } frutas, tem um desconto de: ${
          fruit.discount.value
        } R$ <button class="btn-remove" data-name="${fruit.name}" data-emoji="${
          fruit.emoji
          //botão de remover adicionado com os data-* dos elementos dos objetos
        }" data-price="${fruit.price}" >REMOVER</button><br>`;
      }
    });
    //quando adicionado uma fruta ao carrinho, total deve aparecer com o valor do carrinho somado e retornado para ele
    cartSpan.innerHTML += `Total: ${totalPrice.toFixed(2)}`;

    //Seleciona todos os botões com a Class .btn-remove e cria uma lista desses botões
    document.querySelectorAll(".btn-remove").forEach((btnRemove) => {
      // cria um evento de click
      btnRemove.addEventListener("click", (event) => {
        //uma variavel que puxa o elemento nome de dentro de cada objeto do botão
        const fruitRemoveName = event.target.dataset.name;

        //verifica se na lista cartItem tem name
        if (cartItems.has(fruitRemoveName)) {
          //se tiver, verifica quantidade que tem
          const currentQtd = cartItems.get(fruitRemoveName);
          // se quantidade for maior que 1
          if (currentQtd > 1) {
            //deve diminuir quantidade com 1 a menos
            cartItems.set(fruitRemoveName, currentQtd - 1);
          } else {
            //se for igual a 1, deve remover o name do carrinho
            cartItems.delete(fruitRemoveName);
          }
        }
        //inicia a updateCartDisplay atualizada
        updateCartDisplay();
      });
    });
  }
}

main();
