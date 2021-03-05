var eventBus = new Vue()

Vue.component('product',{
	props:{
		premium: {
			type:Boolean,
			required:true

		},
		detail: {
			type:Boolean,
			required: true
		}
	},
	template:`  
	 <div class="product">
<div class ="product-image">
<img v-bind:src="image">
</div>
<div class="product-info"> </div>
<h1>{{title}}</h1>

<p v-show="inStock"
class="stock-status"
   :style="{textDecoration: inStock}"
>In Stock!</p>


<p v-show="!inStock"
   class="stock-status"
   :style="{textDecoration: !inStock}"
>In Stock!</p>

<p v-show="onSale"
class="onSale-status"
   :style="{textDecoration: onSale}"
>{{onSale_status}}</p>
<p>Shipping:	{{ shipping }}</p>
<p>Detail :     {{ detail   }}></p>
<ul>
<li v-for="detail in details">{{ detail }}</li>
</ul>
<div v-for="(variant,index ) in variants "
:key="variant.variantId"
class="colour-box"
:style="{ backgroundColor: variant.variantColour}"
@mouseover="updateProduct(index)">
</div>


<ul>
<li v-for="data in dataDisplay">{{ data }}</li>
</ul>
<div id="description">
<h1>{{description}}</h1>
</div>
<div class="product-link">
<a v-bind:href="waterfall">Click Here!</a><br><br>

<button v-on:click="addToCart"
:disabled="!inStock"
:class="{ disabledButton :!inStock}">
Add To Cart</button>
</div>
<!--<button v-on:click="removeCart">Remove from Cart</button>-->
<product-tabs :reviews == "reviews" ></product-tabs>

</div>	 
`,

	data(){
		return {
			brand: 'Vue Mastery',
			product: 'Socks',
			status: 'On Sale!',
			selectedVariance: 0,
			description: 'A pair of warm, fuzzy socks',
			waterfall: 'https://www.tripadvisor.com/blog/most-beautiful-waterfalls-usa-america-bucket-list/',
			onSale: true,
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			variants: [
				{
					variantId: 2234,
					variantColour: "Green",
					variantQuantity: 10,
					variantImage: 'https://tse1.mm.bing.net/th?id=OIP.Sy5bLevJuCbZn5d_Y9urwwHaLH&pid=Api&P=0&w=300&h=300'

				},
				{
					variantId: 2235,
					variantColour: "Blue",
					variantQuantity: 0,
					variantImage: 'https://tse3.mm.bing.net/th?id=OIP.rMBvumba7dpFWodp5kA3JQHaIx&pid=Api&P=0&w=300&h=300'
				},

			],
            reviews:[],
			dataDisplay: ["Small", "Medium", "Large"],

		}
	},

	methods:{
		updateProduct(index){
			this.selectedVariance = index
			console.log(index)
		},
		addToCart(){
			this.$emit('add-to-cart',this.variants[this.selectedVariance].variantId)

		},

		removeCart(){
			this.remove -= 1;
		},

	},
	computed:{
		title() {
			return this.brand+' ' +this.product
		},
		image(){
			return this.variants[this.selectedVariance].variantImage
		},
		inStock(){
			return this.variants[this.selectedVariance].variantQuantity
		},
		onSale_status(){
			return this.variants[this.selectedVariance].variantQuantity+'  '+ this.brand+' ' +this.product+' '+ this.status
		},
		shipping(){
			 if (this.premium){
				return "Free"
			}return 2.99
		},
        mounted(){
		    eventBus.$on('review-submit',productReview =>{
		        this.reviews.push(productReview)
            })
        },

		detail(){
			if (this.Good){
				return "Good product"
			}return 3.0

		}
	},


})
Vue.component('product-review',{
    template:`
      
 <form class="review-form" @submit.prevent="onSubmit">
 <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
    <li v-for="errors in errors">{{ error }}</li>
</ul>
</p>
<p>
     <label for="name"> Name:</label>
     <input id="name" v-model="name">        
</p>
<p>
     <label for="review"> Review:</label>
     <textarea id ="review" v-model="review" ></textarea>        
</p>
<p>
     <label for="rating"> Rating:</label>
     <select id="rating" v-model.number="rating">
     <option>5</option> 
     <option>4</option> 
     <option>3</option> 
     <option>2</option> 
     <option>1</option> 
     </select>
            
</p>
<p>
<input type="submit" value="Submit">      
</p>      
</form>
        `,
    data() {
        return {
            name:null,
            review:null,
            rating:null,
            errors: []
        }
    },
    methods:{
        onsubmit(){
            if (this.name && this.review && this.rating){
                let productReview = {
                    name:this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted',productReview)
                this.name=null,
                    this.review=null,
                    this.rating=null
            }
            else {
                if (!this.name)this.errors.push("Name required.")
                if (!this.review)this.errors.push("Review required.")
                if (!this.rating)this.errors.push("Rating required.")

            }
        }
    }
})
Vue.component('product-tabs',{
    probs:{
      reviews:{
          type:Array,
          required:true,

      }
    },
    template:`
    <div> 
    <span class="tab"
        :class="{activeTab:selectedTab ===tab}"
        v-for="(tab,index) in tabs" :key="index"
        @click="selectedTab = tab" >
        {{ tab }}
</span>
<div v-show="selectedTab === 'Reviews'">

<div>
<h2>Reviews</h2>
<p v-if = "!reviews.length">There are no review yet.</p>
<ul>
    <li v-for="reviews in reviews">
    <p>{{ review.name }}</p>
      <p>{{ review.rating }}</p>  
      <p>{{ review.review }}</p>
      
    </li>
</ul>
</div>
<product-review> v-show="selectedTab === 'Make a Review'"></product-review>

    </div>
    `,
    data(){
        return{
            tabs:['Reviews','Make a Review'],
            selectedTab:'Reviews'
        }
    }
})

var app = new Vue({
	el:'#app',
	data:{
		premium:true,
		Good:true,
        cart: []

	},
    methods: {
	    updateCart(id){
            this.cart.push(id)
        }
    }

})

Vue.config.devtools = true;