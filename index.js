const canvas = document.querySelector('canvas')
const c= canvas.getContext('2d')

 canvas.width= window.innerWidth
 canvas.height=window.innerHeight

 class Player {
     constructor() {
         
         this.velocity ={
             x: 0,
             y: 0
         }
         this.rotation =0
         const image =new Image()
         image.src = './images/spaceship.png'
         image.onload =() => {
            
             const scale=0.15
         this.image = image
         this.width = image.width* scale
         this.height =image.height* scale
         this.position ={
            x: canvas.width /2 -this.width/2,
            y: canvas.height -this.height-20
        }
        }
    }
     draw(){
            c.save()
            c.translate(
                player.position.x + player.width/2 , player.position.y +player.height/2
            ) 
            c.rotate(this.rotation)
            c.translate (
                -player.position.x -player.width/2,
                -player.position.y -player.height/2
            )
         
            c.drawImage(this.image, this.position.x, this.position.y,this.width,this.height)

            c.restore() 

         
         }

     update(){
         if(this.image){
            this.draw()
             this.position.x += this.velocity.x

         }
         
     }

 }

 class Projectile{
     constructor({position,velocity}){
         this.position = position
         this.velocity = velocity
         this.radius =4
     }

     draw() {
         c.beginPath()
         c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
         c.fillStyle = 'red'
         c.fill()
         c.closePath()
     }

     update() {
         this.draw()
         this.position.x += this.velocity.x
         this.position.y += this.velocity.y
     }
 

 }

 class Invader {
    constructor({position}) {
        
        this.velocity ={
            x: 0,
            y: 0
        }
        const image =new Image()
        image.src = './images/invader.png'
        image.onload =() => {
           
            const scale=1
        this.image = image
        this.width = image.width* scale
        this.height =image.height* scale
        this.position ={
           x: position.x,
           y: position.y
       }
       }
   }
    draw(){
           c.drawImage(this.image, this.position.x, this.position.y,this.width,this.height) 
        }

    update({velocity}){
        if(this.image){
           this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y

        }
        
    }

}
class Grid{
    constructor(){
        this.position={
            x:0,
            y:0
        }
        this.velocity={
            x:8,
            y:0
        }
        this.invaders =[]

        const rows=2+Math.floor(Math.random()*5)
        const columns =5+Math.floor(Math.random()*10)

        this.width =columns *30

        for ( let i=0; i<columns;i++){

            for( let j= 0;j<rows;j++){
            this.invaders.push(new Invader({position: {
                x: i*30,
                y: j*30
            }}))
        }}
        console.log(this.invaders);
    }


    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y=0

        if (this.position.x + this.width >= canvas.width|| this.position.x<=0){
            this.velocity.x = - this.velocity.x
            this.velocity.y = 30
        }

    }

    
}

 const player = new Player()
  const grids=[ new Grid() ]
 const projectiles =[]
  const keys = {
      a: {
          pressed : false
      },
      d: {
          pressed : false
      },
      space: {
          pressed : false
      }
  }

  let frames =1

 function animate() {
     requestAnimationFrame(animate)
     c.fillStyle='black'
     c.fillRect(0,0,canvas.width, canvas.height)
     
     player.update()
     projectiles.forEach((projectile,index) =>{
         if(projectile.position.y +projectile.radius <=0){
             setTimeout (() =>{
                projectiles.splice(index,1)
             },0)
            
         }else{
         projectile.update()
         }
      })
      grids.forEach(grid => {
          grid.update()
          grid.invaders.forEach((invader,i) => {
              invader.update({velocity : grid.velocity})
              projectiles.forEach((projectile,j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y +invader.height && projectile.position.x + projectile.radius>= invader.position.x 
                && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y+projectile.radius >= invader.position.y) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 =>
                             invader2 === invader
                        )
                        const projectileFound = projectiles.find( projectile2 => projectile2 ===projectile)

                        if(invaderFound && projectileFound){
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)

                        if(grid.invaders.length>0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length -1]
                            grid.width= lastInvader.position.x- firstInvader.position.x +lastInvader.width
                            grid.position.x=firstInvader.position.x
                        }
                        }
                    },0)
                }
              })
          })
      })

     if(keys.a.pressed && player.position.x>=0){
         player.velocity.x = -12
         player.rotation =-0.15
     } else if(keys.d.pressed && player.position.x+player.width <=canvas.width){
        player.velocity.x = 12
        player.rotation =0.15
    } else {
         player.velocity.x = 0
         player.rotation =0
     }
     if(frames % 500 ==0){
         grids.push(new Grid())
     }
     frames ++
 }
 animate()

 window.addEventListener('keydown', ({key})=>{
     console.log(key)
     switch (key){
         case 'ArrowLeft':
             console.log('left')
              keys.a.pressed= true
             break
        case 'ArrowRight':
            console.log('right')
            keys.d.pressed =true
            break
        case ' ':
            console.log('space')
            projectiles.push(new Projectile({
                position: {
                    x:player.position.x + player.width/2,
                    y:player.position.y
                },
                velocity:{
                   x:0,
                   y:-10
               
                }
           
            }))
            //console.log(projectiles)
            break       
             
     }
 })

 window.addEventListener('keyup', ({key})=>{
    switch (key){
        case 'ArrowLeft':
            console.log('left')
             keys.a.pressed= false
            break
       case 'ArrowRight':
           console.log('right')
           keys.d.pressed =false
           break
       case ' ':
           console.log('space')
           break       
            
    }
})
 