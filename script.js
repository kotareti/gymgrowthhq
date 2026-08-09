const USERS_KEY="gghq_users";
const SESSION_KEY="gghq_session";
const ORDERS_KEY="gghq_orders";

let currentUser=null;

let currentOrder={
    service:"",
    plan:"",
    clientName:"",
    gymName:"",
    instagram:"",
    goal:"",
    notes:"",
    instructions:"",
    videos:[]
};

let currentOrderId=null;

function getUsers(){
    try{
        return JSON.parse(localStorage.getItem(USERS_KEY))||[];
    }catch{
        return[];
    }
}

function saveUsers(users){
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
}

function getOrders(){
    try{
        return JSON.parse(localStorage.getItem(ORDERS_KEY))||[];
    }catch{
        return[];
    }
}

function saveOrders(orders){
    localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));
}

function saveSession(user){
    localStorage.setItem(SESSION_KEY,JSON.stringify(user));
}

function getSession(){
    try{
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    }catch{
        return null;
    }
}

function clearSession(){
    localStorage.removeItem(SESSION_KEY);
}

function isLoggedIn(){
    return!!currentUser;
}

function getInitial(name){
    return name?name.trim().charAt(0).toUpperCase():"?";
}

function setText(id,value){
    const el=document.getElementById(id);
    if(el)el.textContent=value||"—";
}

function escapeHTML(value){
    if(!value)return"";
    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function showToast(message,icon="✓"){
    const toast=document.getElementById("toast");
    const text=document.getElementById("toastMessage");
    const iconEl=document.getElementById("toastIcon");

    if(!toast)return;

    if(text)text.textContent=message;
    if(iconEl)iconEl.textContent=icon;

    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },2200);
}

function showScreen(id){

    document.querySelectorAll(".app-screen").forEach(screen=>{
        screen.classList.remove("active-screen");
    });

    const screen=document.getElementById(id);

    if(!screen)return;

    screen.classList.add("active-screen");

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    updateAccountUI();

    if(id==="orders"){
        renderOrders();
    }

    if(id==="order-review"){
        updateReview();
    }

    if(id==="order-details"){
        const order=findCurrentOrder();

        if(order){
            renderOrderDetails(order);
        }
    }
}

function updateAccountUI(){

    const headerButton=document.getElementById("accountHeaderButton");
    const headerInitial=document.getElementById("headerAccountInitial");
    const headerName=document.getElementById("headerAccountName");

    const homeCard=document.getElementById("loggedInHomeCard");
    const homeButton=document.getElementById("homeAccountButton");
    const homeInitial=document.getElementById("homeAccountInitial");
    const homeName=document.getElementById("homeAccountName");
    const homeEmail=document.getElementById("homeAccountEmail");

    const accountInitial=document.getElementById("accountInitial");
    const accountName=document.getElementById("accountName");
    const accountEmail=document.getElementById("accountEmail");

    if(currentUser){

        const initial=getInitial(currentUser.name);

        if(headerButton)headerButton.style.display="flex";
        if(headerInitial)headerInitial.textContent=initial;
        if(headerName)headerName.textContent=currentUser.name;

        if(homeCard)homeCard.style.display="flex";
        if(homeButton)homeButton.style.display="none";
        if(homeInitial)homeInitial.textContent=initial;
        if(homeName)homeName.textContent=currentUser.name;
        if(homeEmail)homeEmail.textContent=currentUser.email;

        if(accountInitial)accountInitial.textContent=initial;
        if(accountName)accountName.textContent=currentUser.name;
        if(accountEmail)accountEmail.textContent=currentUser.email;

    }else{

        if(headerButton)headerButton.style.display="none";
        if(homeCard)homeCard.style.display="none";
        if(homeButton)homeButton.style.display="flex";

    }
}

function saveClientProfile(){

    if(!currentUser)return;

    const users=getUsers();

    const index=users.findIndex(
        user=>user.id===currentUser.id
    );

    if(index===-1)return;

    const user=users[index];

    user.name=
        currentOrder.clientName||user.name;

    user.gymName=
        currentOrder.gymName||user.gymName||"";

    user.instagram=
        currentOrder.instagram||user.instagram||"";

    users[index]=user;

    saveUsers(users);

    currentUser.name=user.name;
    currentUser.gymName=user.gymName;
    currentUser.instagram=user.instagram;

    saveSession(currentUser);
}

function fillClientDetails(){

    if(!currentUser)return;

    const name=document.getElementById("clientName");
    const gym=document.getElementById("gymName");
    const instagram=document.getElementById("instagramHandle");

    if(name)name.value=currentUser.name||"";
    if(gym)gym.value=currentUser.gymName||"";
    if(instagram)instagram.value=currentUser.instagram||"";
}

function startOrder(){

    if(!currentUser){
        showScreen("login");
        return;
    }

    fillClientDetails();
    showScreen("order");
}

function loginUser(){

    const emailInput=document.getElementById("loginEmail");
    const passwordInput=document.getElementById("loginPassword");

    const email=emailInput.value.trim().toLowerCase();
    const password=passwordInput.value;

    if(!email||!password){
        showToast("Enter email and password","!");
        return;
    }

    const users=getUsers();

    const user=users.find(
        item=>item.email===email
    );

    if(!user){
        showToast("Account not found","!");
        return;
    }

    if(user.password!==password){
        showToast("Wrong password","!");
        return;
    }

    currentUser={
        id:user.id,
        name:user.name,
        email:user.email,
        gymName:user.gymName||"",
        instagram:user.instagram||""
    };

    saveSession(currentUser);

    updateAccountUI();
    fillClientDetails();

    emailInput.value="";
    passwordInput.value="";

    showToast("Login successful","✓");

    showScreen("order");
}

function createAccount(){

    const nameInput=document.getElementById("signupName");
    const emailInput=document.getElementById("signupEmail");
    const passwordInput=document.getElementById("signupPassword");

    const name=nameInput.value.trim();
    const email=emailInput.value.trim().toLowerCase();
    const password=passwordInput.value;

    if(!name||!email||!password){
        showToast("Please fill all details","!");
        return;
    }

    if(password.length<6){
        showToast("Password must be at least 6 characters","!");
        return;
    }

    const users=getUsers();

    if(users.some(user=>user.email===email)){
        showToast("Email already registered","!");
        return;
    }

    const newUser={
        id:"USER-"+Date.now(),
        name:name,
        email:email,
        password:password,
        gymName:"",
        instagram:"",
        createdAt:new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    currentUser={
        id:newUser.id,
        name:newUser.name,
        email:newUser.email,
        gymName:"",
        instagram:""
    };

    saveSession(currentUser);

    nameInput.value="";
    emailInput.value="";
    passwordInput.value="";

    updateAccountUI();
    fillClientDetails();

    showToast("Account created","✓");

    showScreen("order");
}

function logoutUser(){

    currentUser=null;

    clearSession();

    currentOrder={
        service:"",
        plan:"",
        clientName:"",
        gymName:"",
        instagram:"",
        goal:"",
        notes:"",
        instructions:"",
        videos:[]
    };

    currentOrderId=null;

    GGHQ_clearVideoSelection();

    updateAccountUI();

    showToast("Logged out","✓");

    showScreen("home");
}

function selectService(service){

    if(
        service!=="reel-editing"&&
        service!=="transformation"
    ){
        return;
    }

    currentOrder.service=service;
    currentOrder.plan="";

    if(service==="reel-editing"){
        showScreen("plan-reel-editing");
        return;
    }

    if(service==="transformation"){
        showScreen("plan-transformation");
        return;
    }
}

function selectPlan(service,plan){

    if(
        service!=="reel-editing"&&
        service!=="transformation"
    ){
        return;
    }

    currentOrder.service=service;
    currentOrder.plan=plan||"standard";

    if(currentUser){
        fillClientDetails();
        showScreen("order");
    }else{
        showScreen("login");
    }
}

function saveStepOne(){

    const name=document.getElementById("clientName");
    const gym=document.getElementById("gymName");
    const instagram=document.getElementById("instagramHandle");

    if(!name||!gym)return false;

    currentOrder.clientName=name.value.trim();
    currentOrder.gymName=gym.value.trim();
    currentOrder.instagram=
        instagram?instagram.value.trim():"";

    if(currentUser){
        saveClientProfile();
    }

    return true;
}

function goOrderNext(step){

    if(step===2){

        if(!saveStepOne()){
            showToast("Please enter your details","!");
            return;
        }

        showScreen("order-project");
        return;
    }

    if(step===3){

        const goal=document.getElementById("projectGoal");
        const notes=document.getElementById("projectNotes");

        currentOrder.goal=
            goal?goal.value:"";

        currentOrder.notes=
            notes?notes.value.trim():"";

        showScreen("order-upload");
        return;
    }

    if(step===4){

        showScreen("order-instructions");
        return;
    }

    if(step===5){

        const instructions=
            document.getElementById("specialInstructions");

        currentOrder.instructions=
            instructions?instructions.value.trim():"";

        updateReview();

        showScreen("order-review");
    }
}

function goOrderBack(step){

    if(step===1){
        showScreen("order");
    }

    if(step===2){
        showScreen("order-project");
    }

    if(step===3){
        showScreen("order-upload");
    }

    if(step===4){
        showScreen("order-instructions");
    }
}


/* =========================================================
   FINAL VIDEO UPLOAD SYSTEM
   ========================================================= */

const GGHQ_VIDEO_INPUT=
    document.getElementById("videoFiles");

let GGHQ_SELECTED_FILES=[];

if(GGHQ_VIDEO_INPUT){

    GGHQ_VIDEO_INPUT.setAttribute(
        "multiple",
        "multiple"
    );

    GGHQ_VIDEO_INPUT.setAttribute(
        "accept",
        "video/*"
    );
}

function GGHQ_clearVideoSelection(){

    GGHQ_SELECTED_FILES=[];

    if(GGHQ_VIDEO_INPUT){
        GGHQ_VIDEO_INPUT.value="";
    }

    if(typeof currentOrder!=="undefined"){
        currentOrder.videos=[];
    }

    const container=
        document.getElementById("selectedFiles");

    if(container){
        container.innerHTML="";
    }
}

function GGHQ_formatVideoSize(bytes){

    if(!bytes)return"";

    const mb=bytes/(1024*1024);

    if(mb<1){
        return Math.round(bytes/1024)+" KB";
    }

    return mb.toFixed(1)+" MB";
}

if(!document.getElementById("gghq-final-video-styles")){

    const style=document.createElement("style");

    style.id="gghq-final-video-styles";

    style.textContent=`

        .gghq-video-gallery{
            display:grid;
            grid-template-columns:
                repeat(2,minmax(0,1fr));
            gap:12px;
            margin-top:16px;
        }

        .gghq-video-card{
            position:relative;
            overflow:hidden;
            border-radius:16px;
            background:#111118;
            border:2px solid rgba(139,92,246,.75);
            box-shadow:0 6px 18px rgba(0,0,0,.22);
        }

        .gghq-video-card video{
            display:block;
            width:100%;
            aspect-ratio:16/10;
            object-fit:cover;
            background:#08080c;
        }

        .gghq-video-number{
            position:absolute;
            top:8px;
            left:8px;
            z-index:3;
            min-width:28px;
            height:28px;
            padding:0 8px;
            border-radius:20px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(0,0,0,.78);
            color:#fff;
            font-size:12px;
            font-weight:800;
        }

        .gghq-video-selected{
            position:absolute;
            top:8px;
            right:8px;
            z-index:3;
            padding:6px 9px;
            border-radius:20px;
            background:#35d477;
            color:#07140d;
            font-size:10px;
            font-weight:900;
            box-shadow:0 3px 10px rgba(0,0,0,.35);
        }

        .gghq-video-info{
            padding:9px 10px 11px;
        }

        .gghq-video-name{
            color:#fff;
            font-size:12px;
            font-weight:600;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }

        .gghq-video-size{
            margin-top:4px;
            color:#777783;
            font-size:11px;
        }

        .gghq-video-count{
            width:100%;
            margin-top:16px;
            padding:14px 16px;
            border-radius:14px;
            background:rgba(139,92,246,.14);
            border:1px solid rgba(139,92,246,.45);
            color:#fff;
            text-align:center;
            font-size:15px;
            font-weight:800;
        }

        .gghq-video-empty{
            margin-top:16px;
            padding:18px;
            border-radius:14px;
            background:rgba(255,255,255,.03);
            color:#8f8f9d;
            text-align:center;
            font-size:14px;
        }

        @media(min-width:600px){
            .gghq-video-gallery{
                grid-template-columns:
                    repeat(3,minmax(0,1fr));
            }
        }
    `;

    document.head.appendChild(style);
}

function GGHQ_renderVideos(){

    const container=
        document.getElementById(
            "selectedFiles"
        );

    if(!container)return;

    container.innerHTML="";

    if(!GGHQ_SELECTED_FILES.length){

        container.innerHTML=`
            <div class="gghq-video-empty">
                No videos selected yet.
            </div>
        `;

        return;
    }

    const gallery=
        document.createElement("div");

    gallery.className=
        "gghq-video-gallery";

    GGHQ_SELECTED_FILES.forEach(
        (file,index)=>{

            const card=
                document.createElement("div");

            card.className=
                "gghq-video-card";

            const number=
                document.createElement("div");

            number.className=
                "gghq-video-number";

            number.textContent=
                index+1;

            const selected=
                document.createElement("div");

            selected.className=
                "gghq-video-selected";

            selected.textContent=
                "✓ SELECTED";

            const video=
                document.createElement("video");

            video.muted=true;
            video.playsInline=true;
            video.preload="metadata";

            video.setAttribute(
                "playsinline",
                ""
            );

            const previewURL=
                URL.createObjectURL(file);

            video.src=previewURL;

            video.addEventListener(
                "loadedmetadata",
                function(){

                    try{

                        if(video.duration>0.2){
                            video.currentTime=0.1;
                        }

                    }catch(e){}

                }
            );

            const info=
                document.createElement("div");

            info.className=
                "gghq-video-info";

            const name=
                document.createElement("div");

            name.className=
                "gghq-video-name";

            name.textContent=
                file.name;

            const size=
                document.createElement("div");

            size.className=
                "gghq-video-size";

            size.textContent=
                GGHQ_formatVideoSize(
                    file.size
                );

            info.appendChild(name);
            info.appendChild(size);

            card.appendChild(video);
            card.appendChild(number);
            card.appendChild(selected);
            card.appendChild(info);

            gallery.appendChild(card);
        }
    );

    container.appendChild(gallery);

    const count=
        document.createElement("div");

    count.className=
        "gghq-video-count";

    count.textContent=
        `✓ ${GGHQ_SELECTED_FILES.length} VIDEO${
            GGHQ_SELECTED_FILES.length===1?"":"S"
        } SELECTED`;

    container.appendChild(count);
}

function handleVideoFiles(files){

    const newFiles=
        Array.from(files||[]);

    if(!newFiles.length)return;

    newFiles.forEach(file=>{

        const exists=
            GGHQ_SELECTED_FILES.some(
                oldFile=>
                    oldFile.name===file.name&&
                    oldFile.size===file.size&&
                    oldFile.lastModified===
                        file.lastModified
            );

        if(!exists){
            GGHQ_SELECTED_FILES.push(file);
        }
    });

    if(typeof currentOrder!=="undefined"){

        currentOrder.videos=
            GGHQ_SELECTED_FILES.map(
                file=>({
                    name:file.name,
                    size:file.size,
                    lastModified:
                        file.lastModified
                })
            );
    }

    GGHQ_renderVideos();

    if(GGHQ_VIDEO_INPUT){
        GGHQ_VIDEO_INPUT.value="";
    }

    showToast(
        `${GGHQ_SELECTED_FILES.length} video${
            GGHQ_SELECTED_FILES.length===1?"":"s"
        } selected`,
        "✓"
    );
}


/*
   Whenever Upload screen opens:
   start completely fresh.
*/

const GGHQ_originalShowScreen=
    showScreen;

showScreen=function(id){

    if(id==="order-upload"){
        GGHQ_clearVideoSelection();
    }

    GGHQ_originalShowScreen(id);
};


function updateReview(){

    const service=
        currentOrder.service==="reel-editing"
            ?"Reel Editing"
            :currentOrder.service==="transformation"
                ?"Transformation Reel"
                :"—";

    const plan=
        currentOrder.plan==="premium"
            ?"Premium"
            :"Standard";

    setText(
        "reviewService",
        service
    );

    setText(
        "reviewPlan",
        plan
    );

    setText(
        "reviewClient",
        currentOrder.clientName
    );

    setText(
        "reviewGym",
        currentOrder.gymName
    );

    setText(
        "reviewInstagram",
        currentOrder.instagram
    );

    setText(
        "reviewVideos",
        currentOrder.videos.length+
        " video(s)"
    );
}

function submitOrder(){

    if(!currentUser){
        showScreen("login");
        return;
    }

    if(!currentOrder.service){

        showToast(
            "Please select a service",
            "!"
        );

        showScreen("services");
        return;
    }

    if(!currentOrder.plan){
        currentOrder.plan="standard";
    }

    saveStepOne();

    const orders=getOrders();

    const order={

        id:
            "GGHQ-"+Date.now(),

        userId:
            currentUser.id,

        userEmail:
            currentUser.email,

        service:
            currentOrder.service,

        plan:
            currentOrder.plan,

        clientName:
            currentOrder.clientName,

        gymName:
            currentOrder.gymName,

        instagram:
            currentOrder.instagram,

        goal:
            currentOrder.goal,

        notes:
            currentOrder.notes,

        instructions:
            currentOrder.instructions,

        videos:
            currentOrder.videos,

        status:
            "Submitted",

        deliveryStatus:
            "Editing in Progress",

        finalVideo:
            "",

        createdAt:
            new Date().toISOString()
    };

    orders.push(order);

    saveOrders(orders);

    currentOrderId=order.id;

    showToast(
        "Order submitted successfully",
        "✓"
    );

    setTimeout(
        ()=>{

            renderOrders();

            showScreen("account");

        },
        500
    );

    currentOrder={

        service:"",
        plan:"",

        clientName:
            currentUser.name||"",

        gymName:
            currentUser.gymName||"",

        instagram:
            currentUser.instagram||"",

        goal:"",
        notes:"",
        instructions:"",
        videos:[]
    };

    /*
       Clear uploaded files for next order.
    */

    GGHQ_clearVideoSelection();
}

function findCurrentOrder(){

    if(!currentOrderId){
        return null;
    }

    const orders=getOrders();

    return orders.find(
        order=>
            order.id===currentOrderId
    );
}

function getMyOrders(){

    if(!currentUser){
        return[];
    }

    return getOrders().filter(
        order=>
            order.userId===currentUser.id
    );
}

function renderOrders(){

    const list=
        document.getElementById(
            "ordersList"
        );

    if(!list)return;

    list.innerHTML="";

    if(!currentUser){

        list.innerHTML=`
            <div class="empty-state">
                <h3>Login Required</h3>
                <p>Please login to view your orders.</p>
            </div>
        `;

        return;
    }

    const orders=getMyOrders();

    if(!orders.length){

        list.innerHTML=`
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Your submitted orders will appear here.</p>
            </div>
        `;

        return;
    }

    orders
        .slice()
        .reverse()
        .forEach(order=>{

            const card=
                document.createElement(
                    "button"
                );

            card.type="button";

            card.className=
                "order-history-card";

            const service=
                order.service==="reel-editing"
                    ?"Reel Editing"
                    :"Transformation Reel";

            const plan=
                order.plan==="premium"
                    ?"Premium"
                    :"Standard";

            card.innerHTML=`

                <div class="order-history-icon">
                    📦
                </div>

                <div class="order-history-info">

                    <strong>
                        ${service}
                    </strong>

                    <small>
                        ${plan} •
                        ${escapeHTML(order.gymName)}
                    </small>

                    <span class="order-status-small">
                        ${escapeHTML(
                            order.deliveryStatus
                        )}
                    </span>

                </div>

                <span class="account-menu-arrow">
                    →
                </span>

            `;

            card.addEventListener(
                "click",
                ()=>{

                    currentOrderId=
                        order.id;

                    renderOrderDetails(
                        order
                    );

                    showScreen(
                        "order-details"
                    );
                }
            );

            list.appendChild(card);
        });
}

function renderOrderDetails(order){

    if(!order)return;

    const service=
        order.service==="reel-editing"
            ?"Reel Editing"
            :"Transformation Reel";

    const plan=
        order.plan==="premium"
            ?"Premium"
            :"Standard";

    setText(
        "detailOrderNumber",
        "#"+
        order.id.replace(
            "GGHQ-",
            ""
        )
    );

    setText(
        "detailOrderStatus",
        order.deliveryStatus||
        order.status
    );

    setText(
        "detailService",
        service
    );

    setText(
        "detailPlan",
        plan
    );

    setText(
        "detailClient",
        order.clientName
    );

    setText(
        "detailGym",
        order.gymName
    );

    setText(
        "detailGoal",
        order.goal
    );

    setText(
        "detailVideos",
        order.videos
            ?order.videos.length+
             " video(s)"
            :"—"
    );

    setText(
        "detailInstructions",
        order.instructions||"—"
    );
}

function restoreSession(){

    const session=getSession();

    if(!session){

        currentUser=null;
        updateAccountUI();

        return;
    }

    const users=getUsers();

    const user=users.find(
        item=>
            item.id===session.id&&
            item.email===session.email
    );

    if(!user){

        clearSession();
        currentUser=null;
        updateAccountUI();

        return;
    }

    currentUser={

        id:user.id,
        name:user.name,
        email:user.email,

        gymName:
            user.gymName||"",

        instagram:
            user.instagram||""
    };

    updateAccountUI();
}

document.addEventListener(
    "click",
    function(event){

        const button=
            event.target.closest(
                "button, a"
            );

        if(!button)return;

        if(
            button.dataset.screen===
            "account"
        ){

            event.preventDefault();

            if(currentUser){

                updateAccountUI();

                showScreen(
                    "account"
                );

            }else{

                showScreen(
                    "login"
                );
            }

            return;
        }

        if(
            button.dataset.screen===
            "orders"
        ){

            event.preventDefault();

            if(!currentUser){

                showScreen(
                    "login"
                );

                return;
            }

            renderOrders();

            showScreen(
                "orders"
            );

            return;
        }

        if(button.dataset.detail){

            event.preventDefault();

            selectService(
                button.dataset.detail
            );

            return;
        }

        if(button.dataset.planDetail){

            event.preventDefault();

            const service=
                button.dataset.planDetail;

            if(
                service==="reel-editing"
            ){

                showScreen(
                    "plan-reel-editing"
                );
            }

            if(
                service==="transformation"
            ){

                showScreen(
                    "plan-transformation"
                );
            }

            return;
        }

        if(button.dataset.plan){

            event.preventDefault();

            selectPlan(
                button.dataset.plan,
                "standard"
            );

            return;
        }

        if(button.dataset.orderNext){

            event.preventDefault();

            goOrderNext(
                Number(
                    button.dataset.orderNext
                )
            );

            return;
        }

        if(button.dataset.orderBack){

            event.preventDefault();

            goOrderBack(
                Number(
                    button.dataset.orderBack
                )
            );

            return;
        }

        if(button.dataset.screen){

            event.preventDefault();

            showScreen(
                button.dataset.screen
            );

            return;
        }
    }
);

document
    .getElementById("loginButton")
    ?.addEventListener(
        "click",
        loginUser
    );

document
    .getElementById("signupButton")
    ?.addEventListener(
        "click",
        createAccount
    );

document
    .getElementById("logoutButton")
    ?.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            logoutUser();
        }
    );

document
    .getElementById("goToSignup")
    ?.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            showScreen("signup");
        }
    );

document
    .getElementById("goToLogin")
    ?.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            showScreen("login");
        }
    );

document
    .getElementById("videoFiles")
    ?.addEventListener(
        "change",
        function(){

            handleVideoFiles(
                this.files
            );
        }
    );

document
    .getElementById("submitOrderButton")
    ?.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            submitOrder();
        }
    );

restoreSession();

showScreen("home");
