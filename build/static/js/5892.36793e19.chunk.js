"use strict";(self.webpackChunk_coreui_coreui_free_react_admin_template=self.webpackChunk_coreui_coreui_free_react_admin_template||[]).push([[5892],{65892:(e,o,t)=>{t.r(o),t.d(o,{default:()=>m});var r=t(69060),a=t(98372),s=t(51560),n=t(85172),i=t(3084),c=t(92332),l=t(63528),d=t(82496);const u=t(93424);let p=null;const m=()=>{const e=(0,s.i6)(),[o,t]=(0,r.useState)(!1),[m,f]=(0,r.useState)([]),[y,j]=(0,r.useState)([]),[h,x]=(0,r.useState)(0),[b,g]=(0,r.useState)(null),[k,S]=(0,r.useState)(0),[w,_]=(0,r.useState)(0),I=localStorage.getItem("placeOrderData");console.log(I);const z=JSON.parse(I);console.log(z),(0,r.useEffect)((()=>((async()=>{p=await u.load(c),console.log("Protobuf part initialization complete")})(),O(n.a,z.symbol),()=>{})),[n.a]);const O=async(e,o)=>{console.log(o);try{const r=await(async e=>{let o={"Content-type":"application/json",Authorization:"Bearer "+e};const t=await fetch("https://api-v2.upstox.com/feed/market-data-feed/authorize",{method:"GET",headers:o});if(!t.ok)throw new Error("Network response was not ok");return(await t.json()).data.authorizedRedirectUri})(e),a=new WebSocket(r);return a.onopen=()=>{t(!0),console.log("Connected");const e={guid:"someguid",method:"sub",data:{mode:"full",instrumentKeys:[o]}};a.send(l.Sn.from(JSON.stringify(e)))},a.onclose=()=>{t(!1),console.log("Disconnected")},a.onmessage=async e=>{const t=await(async e=>"arrayBuffer"in e?await e.arrayBuffer():new Promise(((o,t)=>{const r=new FileReader;r.onload=()=>o(r.result),r.onerror=()=>t(),r.readAsArrayBuffer(e)})))(e.data);let r=(e=>p?p.lookupType("com.upstox.marketdatafeeder.rpc.proto.FeedResponse").decode(e):(console.warn("Protobuf part not initialized yet!"),null))(l.Sn.from(t));f((e=>[...e,JSON.stringify(r)])),j(r.feeds[o].ff.marketFF.ltpc),g(r.feeds[o].ff.marketFF.marketLevel.bidAskQuote);const[a,s]=(0,n.U9)(r.feeds[o].ff.marketFF.marketLevel.bidAskQuote);S(a),_(s)},a.onerror=e=>{t(!1),console.log("WebSocket error:",e)},()=>a.close()}catch(r){console.error("WebSocket connection error:",r)}};console.log("ltpc data"),console.log(y);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)(i.AX,{children:[(0,d.jsx)(i.oV,{sm:3}),(0,d.jsxs)(i.oV,{sm:6,children:[console.log(m),(0,d.jsx)(i.So,{className:"mb-3",color:"primary",inverse:!0,progress:{value:75},text:"",title:"P & L",value:(w*z.lot_size*z.quantity-z.open_price*z.lot_size*z.quantity).toFixed(3)}),(0,d.jsx)(i.u0,{children:(0,d.jsxs)(i.Yj,{children:[(0,d.jsx)("b",{children:"Bid Price :"})," ",k,(0,d.jsx)("br",{}),(0,d.jsx)("b",{children:"Ask Price :"})," ",w,(0,d.jsx)("br",{}),(0,d.jsx)("b",{children:"Buy price :"})," ",z.open_price,(0,d.jsx)("br",{}),(0,d.jsx)("b",{children:"Symbol :"})," ",z.trading_symbol,(0,d.jsx)("br",{}),(0,d.jsx)("b",{children:"Buy Time :"})," ",z.open_time]})})]})]}),(0,d.jsxs)(i.AX,{children:[(0,d.jsx)(i.oV,{sm:3}),(0,d.jsxs)(i.oV,{sm:6,children:[(0,d.jsx)("br",{}),(0,d.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,d.jsx)(i.uE,{color:"danger",size:"lg",onClick:o=>(async o=>{const t=localStorage.getItem("userData");let r=JSON.parse(t);r=JSON.parse(r),console.log(r);let s=r.data.token;console.log(s),r.data.user_id;try{const t={"Content-Type":"application/json",Authorization:"Bearer ".concat(s)},r=await a.c.put("http://139.59.39.167/api/v1/order/".concat(o.id),{user_id:o.user_id,symbol:o.symbol,quantity:o.quantity,lot_size:o.lot_size},{headers:t});console.log(r),alert(r.data.data.message),e("/portfolio")}catch(n){throw console.error("Error closing order:",n),n}})(z),children:"Close Order"})})]})]})]})}},85172:(e,o,t)=>{function r(e){const o=e.map((e=>e.bp)),t=e.map((e=>e.ap));return[Math.max(...o),Math.min(...t)]}function a(e){const o=e.map((e=>e.ap));return Math.max(...o)}t.d(o,{U9:()=>r,Z1:()=>a,a:()=>s});const s="eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI2MkFIQVAiLCJqdGkiOiI2NWQ4MmJjNjI3ZWFkOTMzYjUzODM5YWYiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDg2NjU3OTgsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwODcyNTYwMH0.aOzgAAo2X30P-edOaP3rjOVpzQ8KXW0s_8e_HRSwoI0"},92332:(e,o,t)=>{e.exports=t.p+"static/media/marketDataFeed.79b53914dafd92460c0d.proto"}}]);
//# sourceMappingURL=5892.36793e19.chunk.js.map