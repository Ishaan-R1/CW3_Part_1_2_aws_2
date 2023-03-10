let app = new Vue({
  el: "#App",
  data: {
    showProduct: true,
    showTestConsole: false,
    testConsole: true,

    path: "https://cdn-icons-png.flaticon.com/512/221/221945.png",
    text: "Maths Icon",
    // Display data of 1 subject
    subject: {
      subject: "Math",
      location: "London",
      price: 100,
      spaces: 5,
      image_path: "https://cdn-icons-png.flaticon.com/512/221/221945.png",
      image_text: "Maths Icon",
    },
    // Getting lessons from lessons.js instead of AWS
    // subjects: arrayOfObjects,
    // Call array of objects from lessons.js file into 'subjects' object
    subjects: [],
    orderID: [],
    search: [],
    getID: [],
    getSpaces: [],

    // Object to hold data of user inputted order details
    order: {
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
    },
    radioBtn: {
      option: "",
    },
    // Object to hold data of message when order is successful
    orderMsg: {
      msg: "Thank for your order. Your order has been placed.",
    },
    // Object to keep track of what user inputs in the search bar
    searchBar: {
      input: "",
      input2: "",
    },
    // Object to hold data to see if user selects radio button that matches this value
    //  to check they have selected the acend or decend button
    sortOrder: {
      order: "ascend",
    },
    // Empty cart array to push data to once user selects button
    cart: [],
    serverURL: "http://localhost:3000/collections/lessons",
    awsServerURL:
      "https://afterschoolapp2-env.eba-wwaj2wgs.eu-west-2.elasticbeanstalk.com/collections/lessons",
  },
  created: function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
    // Fetch to retrieve lessons with GET
    fetch(this.awsServerURL).then(function (response) {
      response.json().then(function (json) {
        console.log(json);
        // Push JSON data to subjects array when page is loaded
        app.subjects = json;
      });
    });

    // setInterval(this.searchLessons, 1000);
  },
  methods: {
    toggleTestConsole() {
      this.showTestConsole = !this.showTestConsole;
    },
    reloadPage() {
      window.location.reload();
    },
    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
      console.log("All Caches Deleted");
    },
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
      console.log("ServiceWorkers Unregistered");
    },
    // Fetch to send search request of subject name to backend
    searchLessons() {
      let subject = this.searchBar.input2;
      // Get user input of a subject and use fetch to retreive data from URL
      fetch("https://afterschoolapp2-env.eba-wwaj2wgs.eu-west-2.elasticbeanstalk.com/search/lessons/" + subject).then(function (
        response
      ) {
        response.json().then(function (json) {
          console.log(json);
          // Push JSON data to subjects array which loads on click
          app.subjects = json;
        });
      });
    },
    // Function to get the correct order ID to save order data to
    getLessonID(id) {
      /* Once user clicks on lesson, lesson ID is pushed to order array which is then sent to 
      'orders' collection via POST in 'lesson_id' field */
      this.orderID.push(id);
    },
    // Function to POST user first name, number, spaces and lesson IDs
    postOrder(firstName, phone_number, id) {
      const order = {
        name: firstName,
        phone_number: phone_number,
        // Lesson IDs and spaces retrieved from array
        lesson_id: this.orderID.toString(),
        spaces: this.cart.length,
      };
      // Fetch to save new order with POST when submitted
      fetch("https://afterschoolapp2-env.eba-wwaj2wgs.eu-west-2.elasticbeanstalk.com/collections/orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-type": "application/json",
        },
      })
        // Convert data to JSON
        .then((response) => response.json())
        .then((json) => console.log(json));
    },
    // Function to execute once user confirms order
    updateSpaces1() {
      // Fetch to update lesson spaces with PUT - ID is taken once user clicks on specific lesson
      for (let i = 0; i < this.cart.length; i++) {
          fetch("https://afterschoolapp2-env.eba-wwaj2wgs.eu-west-2.elasticbeanstalk.com/collections/lessons/" + this.getID[i].toString(), {
            method: "PUT",
            body: JSON.stringify({
              // Spaces is decremented by 1 and updated in database
              spaces: this.getSpaces[i],
            }),
            headers: {
              "Content-type": "application/json",
            },
          })
            // Convert data to JSON
            .then((response) => response.json())
            .then((json) => console.log(json));
        }
    },
    updateSpaces2(spacesNum, id) {
      // Fetch to update lesson spaces with PUT - ID is taken once user clicks on specific lesson
      this.getID.push(id);
      this.getSpaces.push(spacesNum);
    },
    // Method to decrease number of spaces once user clicks 'Add to Cart' button
    decrementSpaces() {
      if (this.spaces > 0) {
        this.spaces--;
      }
    },
    // Method to add an item to cart array once user clicks 'Add to Cart' button
    addToCart: function (product) {
      this.cart.push(product); // push the relevant subject to store in the cart array
      console.log(this.cart);
      console.log("Added to Arr " + this.cart.length);
    },
    // Method to remove an item from cart array once user clicks 'Remove' button
    removeLesson(product, i) {
      this.cart.splice(this.cart.indexOf(product), 1); // remove specific item in cart array
      console.log(this.cart.indexOf(product));
    },
    addBackRemovedLesson(sub) {
      sub.spaces++; // Display new current spaces number to user
    },
    // Method to check which page to display
    displayCheckout() {
      if (this.showProduct) {
        this.showProduct = false;
      } else {
        this.showProduct = true;
      }
    },
    // Method to decrease number of spaces once user clicks 'Add to Cart' button
    btn(sub) {
      if (sub.spaces > 0) {
        sub.spaces--;
      }
      console.log(sub.spaces);
    },
    // Method to check if there are any more spaces left
    noMoreSpaces: function (sub) {
      console.log(sub.spaces);
      console.log(sub.spaces == 5);
      // check and return if spaces is more than 0, otherwise button will be disabled
      return sub.spaces > 0;
    },
    // Method to create confirmation button
    checkoutBtn: function () {
      let para = document.createElement("p"); // Createe p tag in index.html
      para.innerText = this.orderMsg.msg; // add order message in this paragraph and append to id
      document.getElementById("confirmCheckout").appendChild(para);
    },
    // Method to sort subjects in ascended order
    sort: function (option) {
      // create function to compare each element
      function compare(a, b) {
        if (a[option] > b[option]) return 1;
        if (a[option] < b[option]) return -1;
        return 0;
      }
      this.subjects.sort(compare); // sort all the already compared elements
    },
    // Method to sort subjects in descended order
    sort2: function (option) {
      // create function to compare each element
      function compare(a, b) {
        if (a[option] > b[option]) return -1;
        if (a[option] < b[option]) return 1;
        return 0;
      }
      // sort all the already compared elements
      this.subjects.sort(compare);
    },
    ascend: function () {
      this.sortOrder.order = "ascend";
      console.log(this.sortOrder.order);
    },
    descend: function () {
      this.sortOrder.order = "descend";
      console.log(this.sortOrder.order);
    },
  },
  computed: {
    // Computed property to check how many items are added to cart array
    cartItemCount: function () {
      // Displays number of items in cart array or returns empty string if array is empty
      return this.cart.length || "";
    },
    // Computed property to check if any searches match the subjects title or location
    searchFunction: function () {
      // For loop to loop through all the subjects
      for (let j = 0; j < this.subjects.length; j++) {
        return this.subjects.filter((matches) => {
          return (
            // and check if the users input matches the subjects stored in the object - then returns all the matches subjects
            matches.subject
              .toLowerCase()
              .includes(this.searchBar.input.toLowerCase()) ||
            matches.location
              .toLowerCase()
              .includes(this.searchBar.input.toLowerCase())
          );
        });
      }
    },
    // Computed property to check if checkout button can be enabled or not
    canViewCart: function () {
      return this.cartItemCount >= 1; // check if number of items in cart array is more than or equal to 1
    },

    // Computed property to check if checkout  button on checkout page can be enabled or not
    checkForm: function () {
      return (
        // Regular expressions to check if the first and last name contains only letters
        /^[a-zA-Z]+$/.test(this.order.firstName) &&
        /^[a-zA-Z]+$/.test(this.order.lastName) &&
        // Regular expressions to check if the phone number contains only numbers
        /^[0-9]+$/.test(this.order.phone) &&
        // Check if all fields are inputted
        this.order.firstName.length > 0 &&
        this.order.lastName.length > 0 &&
        this.order.address.length > 0 &&
        this.order.phone.length > 0
      );
    },
  },
});
