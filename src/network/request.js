import axios from 'axios'
export function request(config) {
    // 网络封装,返回一个promise对象，在调用时可以通过.then自己取出结果
    return new Promise((resolve, reject) => {
        // 创建axios实例
        const instance = axios.create({
            baseURL: 'http://120.77.147.48:3000/api',
            timeout: 5000
        })
        instance(config)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}