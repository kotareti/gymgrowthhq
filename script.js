*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    scroll-behavior:smooth;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    background:#111;
    color:#fff;
    line-height:1.6;
}

/* Header */

header{
    width:100%;
    background:#1a1a1a;
    position:sticky;
    top:0;
    z-index:1000;
}

nav{
    max-width:1200px;
    margin:auto;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:20px;
}

.logo{
    display:flex;
    align-items:center;
    gap:10px;
}

.logo img{
    width:50px;
    height:50px;
}

nav ul{
    display:flex;
    list-style:none;
    gap:25px;
}

nav a{
    color:white;
    text-decoration:none;
    transition:.3s;
}

nav a:hover{
    color:#ff7a00;
}

/* Hero */

.hero{
    min-height:90vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
    padding:30px;
}

.hero h1{
    font-size:3rem;
    margin-bottom:20px;
}

.hero p{
    font-size:1.2rem;
    color:#ccc;
    max-width:650px;
}

.btn{
    margin-top:30px;
    display:inline-block;
    background:#ff7a00;
    color:white;
    padding:15px 35px;
    border-radius:8px;
    text-decoration:none;
    font-weight:bold;
    transition:.3s;
}

.btn:hover{
    background:#ff9500;
}

/* Sections */

section{
    padding:80px 20px;
}

section h2{
    text-align:center;
    margin-bottom:40px;
    font-size:2rem;
}

/* Cards */

.cards{
    max-width:1100px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:25px;
}

.card{
    background:#1d1d1d;
    border-radius:15px;
    padding:30px;
    text-align:center;
    transition:.3s;
}

.card:hover{
    transform:translateY(-8px);
}

.card h3{
    margin-bottom:15px;
}

.card h1{
    color:#ff7a00;
    margin:15px 0;
}

/* Steps */

.steps{
    max-width:900px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    gap:20px;
    text-align:center;
}

.steps div{
    background:#1d1d1d;
    padding:25px;
    border-radius:12px;
}

/* Form */

form{
    max-width:700px;
    margin:auto;
    display:flex;
    flex-direction:column;
    gap:20px;
}

input,
select,
textarea{
    padding:15px;
    border:none;
    border-radius:8px;
    font-size:16px;
}

button{
    padding:15px;
    border:none;
    border-radius:8px;
    background:#ff7a00;
    color:white;
    font-size:18px;
    cursor:pointer;
    transition:.3s;
}

button:hover{
    background:#ff9500;
}

/* Footer */

footer{
    background:#1a1a1a;
    text-align:center;
    padding:25px;
    margin-top:50px;
}

/* Mobile */

@media(max-width:768px){

nav{
    flex-direction:column;
    gap:15px;
}

nav ul{
    flex-direction:column;
    text-align:center;
}

.hero h1{
    font-size:2.2rem;
}

.hero p{
    font-size:1rem;
}

}
