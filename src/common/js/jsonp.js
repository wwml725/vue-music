import originJsonp from 'jsonp'
//为什么要将jsonp再次封装，这个不是挺好用吗？？
//因为很多路径的查询字符串，都有很多相同的代码！！！！
//并且这样可以更直观的填写查询字符串
/**
 *
 * @param url  地址  原版的jsonp中url是拼接好的完整的地址，在这里进行一些操作，可以用起来更方便
 * @param data  查询字符串之类的
 * @param option   这是什么？？
 * @returns {Promise}
 */
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // console.log(url);
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      //url是路径包含查询字符串，option参数可以有callback=‘a’（会拼接在url后面&jsonpCallback='a'）...,callback返回a包含的数据
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
//将对象转化为字符串，之后再和url进行拼接
export function param(data) {
  let url = '';//为什么添加了一个问号，url路径不对了，但是请求到的还是那个合法的路径
  for (var k in data) {
    //data[k] !== undefined  要求不是空对象才赋值data[k],否则就是''
    let value = data[k] !== undefined ? data[k] : '';
    // console.log(value);
    url += '&' + k + '=' + encodeURIComponent(value);//对对象中的每一个属性名加密后再拼接
  }
  // console.log(url);
  // console.log(url.substring(1));//因为查询字符串的开头并不是&,而是?
  //若果url不是空，就返回&后面的，如果是空就返回''
  
  url = url ? url.substring(1) : ''
  // console.log(url);
  return url
}
//这里可以使用querystring.stringify()代替


