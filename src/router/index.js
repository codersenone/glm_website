import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../view/Home.vue';
import Category from '../view/Category.vue';
import Car from '../view/Car.vue';
import Mine from '../view/Mine.vue';
import Detail from '../view/Detail.vue';
import Login from '../view/Login.vue';
import empty from '../view/empty.vue';
import Result from '../view/Result.vue';
import Pay from '../view/Pay.vue';
import OrderList from '../view/OrderList.vue';
import OrderDetail from '../view/OrderDetail.vue';
import Resign from '../view/Resign.vue';
import AddressList from '../view/AddressList.vue';
import AddressEdit from '../view/AddressEdit.vue';
import Search from '../view/Search.vue';
Vue.use(VueRouter)
const routes = [
    {
        path:'/',
        redirect:'/home'
    },
    {
        path:'/home',
        component:Home,
    },
    {
        path:'/category',
        component:Category
    },
    {
        path:'/car',
        component:Car
    },
    {
        path:'/mine',
        component:Mine
    },
    {
        path:'/detail',
        component:Detail, 
    },
    {
        path:'/login',
        component:Login,
    },
    {
        path:'/empty',
        component:empty,
    },
    {
        path:'/result',
        component:Result,
    },
    {
        path:'/pay',
        component:Pay,
    },
    {
        path:'/orderlist',
        component:OrderList,
    },
    {
        path:'/orderdetail',
        component:OrderDetail,
        name:'orderdetail'
    },
    {
        path:'/resign',
        component:Resign,
    },
    {
        path:'/addresslist',
        component:AddressList,
    },
    {
        path:'/addressedit',
        component:AddressEdit,
    },
    {
        path:'/search',
        component:Search,
    }
    
]

const router = new VueRouter({
    mode:'history',
    base:process.env.BASE_URL,
    routes
})

export default router