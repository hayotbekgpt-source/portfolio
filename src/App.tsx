import { useState, useEffect, useRef } from "react";
// Rasmlar va video importi
import heroBg from "./assets/1.jpg";
import project1 from "./assets/2.jpg";
import project2 from "./assets/3.jpg";
import project3 from "./assets/4.jpg";
import project4 from "./assets/5.jpg";
import project5 from "./assets/6.jpg";
import project6 from "./assets/7.mp4"; // Shu joyi videoga o'zgardi

// 1-QOIDANI BUZMASLIK UCHUN TIPLAR (TYPES):
type Particle = {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
};

// Rasmlar va video turini farqlash uchun "type" xususiyati qo'shildi
const PROJECTS_DATA = [
  { img: project1, type: "image", title: "Viskoz Suyuqlik va Muz", category: "FLIP Simulation", desc: "Houdini viskosit (viscosity) xususiyati yordamida yaratilgan yopishqoq suyuqlik va muzlash effekti." },
  { img: project2, type: "image", title: "Procedural O'rgimchak Rig", category: "KineFX / Animatsiya", desc: "KineFX va VEX orqali o'rgimchak harakatlarini protsessual avtomatlashtirish tizimi." },
  { img: project3, type: "image", title: "Keng Ko'lamli Chang & Tutun", category: "Pyro FX", desc: "Portlash va yer yuzasidagi chang to'lqinlarini Pyro solver yordamida volumetrik simulyatsiya qilish." },
  { img: project4, type: "image", title: "Procedural Wireframe Avto", category: "VEX / SOPs", desc: "VEX dasturlash tili orqali avtomobil modelini murakkab chiziqli (wireframe) to'rga aylantirish." },
  { img: project5, type: "image", title: "Qishki Tabiat Generatsiyasi", category: "Environment FX", desc: "Protsessual tarzda yaratilgan daraxtlar va ularning shoxlaridagi qor qoplamini shakllantirish." },
  { img: project6, type: "video", title: "Yumshoq Jism (Soft Body)", category: "Vellum FX", desc: "Vellum solver orqali obyektlarning egiluvchanlik va elastik deformatsiya simulyatsiyasi." },
];

const SKILLS_DATA = [
  { name: "Houdini VEX / Python", level: 95 },
  { name: "Pyro & FLIP Simulyatsiyalari", level: 90 },
  { name: "Procedural Modeling / KineFX", level: 88 },
  { name: "RBD Destruction", level: 85 },
  { name: "Nuke Compositing", level: 75 },
];

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Barchasi");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll hodisasi
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Canvas Particles effekti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          radius: Math.random() * 25 + 10,
          color: `hsla(${Math.random() * 60 + 190}, 100%, 60%, `, 
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * -2 - 0.5,
          life: 1 
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.life + ")";
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        p.radius += 0.5; 
        p.life -= 0.015; 
        
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const categories = ["Barchasi", ...new Set(PROJECTS_DATA.map((p) => p.category))];
  const filteredProjects = activeFilter === "Barchasi" 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  return (
    <div style={{ 
      backgroundColor: "#070b14", 
      color: "#f8fafc", 
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      scrollBehavior: "smooth",
      position: "relative",
      overflowX: "hidden"
    }}>
      
      <canvas 
        ref={canvasRef} 
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.6 }} 
      />

      {/* --- NAVBAR --- */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "1rem clamp(1rem, 5vw, 4rem)", display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: scrolled ? "rgba(7, 11, 20, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(15px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid transparent",
        transition: "0.4s ease"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#3b82f6", textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}>VFX</span>.STUDIO
        </div>
        <nav style={{ display: "flex", gap: "clamp(1rem, 3vw, 2.5rem)" }}>
          {["Bosh sahifa", "Loyihalar", "Aloqa"].map((item) => (
            <a 
              key={item} 
              href={`#${item === 'Bosh sahifa' ? 'hero' : item.toLowerCase()}`} 
              style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" style={{ 
        height: "100vh", position: "relative", display: "flex", 
        alignItems: "center", justifyContent: "center", textAlign: "center", zIndex: 1 
      }}>
        <img src={heroBg} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 20%, #070b14 90%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "0 20px", width: "100%" }}>
          <h2 style={{ color: "#3b82f6", textTransform: "uppercase", letterSpacing: "5px", fontSize: "clamp(0.7rem, 2vw, 1rem)", marginBottom: "1rem" }}>Houdini FX Specialist</h2>
          <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Tasavvurni <br /> <span style={{ color: "#3b82f6", textShadow: "0 0 30px rgba(59,130,246,0.6)" }}>Reallikka</span> Aylantiring
          </h1>
          <p style={{ maxWidth: "700px", margin: "0 auto 3rem", color: "#94a3b8", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.6 }}>
            Kino va o'yin industriyasi uchun mo'ljallangan yuqori darajadagi protsessual modellashtirish, fizika, portlash va suyuqlik simulyatsiyalari.
          </p>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="loyihalar" style={{ padding: "clamp(3rem, 10vw, 6rem) clamp(1rem, 5vw, 4rem)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", textAlign: "center", marginBottom: "1rem", fontWeight: 700 }}>Portfolio</h2>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "0.6rem 1.5rem", borderRadius: "30px", border: "1px solid rgba(59, 130, 246, 0.5)",
                  backgroundColor: activeFilter === cat ? "#3b82f6" : "rgba(15, 23, 42, 0.6)",
                  color: "white", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500, 
                  transition: "all 0.3s ease", backdropFilter: "blur(5px)",
                  boxShadow: activeFilter === cat ? "0 0 15px rgba(59,130,246,0.4)" : "none"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 30vw, 400px), 1fr))", 
            gap: "2.5rem" 
          }}>
            {filteredProjects.map((project, idx) => (
              <div key={idx} style={{ 
                backgroundColor: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", overflow: "hidden",
                border: "1px solid rgba(59, 130, 246, 0.2)", backdropFilter: "blur(10px)",
                transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(59,130,246,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)"; }}
              >
                <div style={{ height: "250px", overflow: "hidden", position: "relative" }}>
                  {/* Turiga qarab Rasm yoki Video render qilish */}
                  {project.type === "video" ? (
                    <video 
                      src={project.img} 
                      autoPlay loop muted playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  ) : (
                    <img 
                      src={project.img} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  )}
                </div>
                <div style={{ padding: "1.8rem" }}>
                  <span style={{ color: "#60a5fa", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{project.category}</span>
                  <h3 style={{ fontSize: "1.4rem", margin: "0.8rem 0", fontWeight: 600 }}>{project.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6 }}>{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SKILLS & CONTACT (TELEGRAM) --- */}
      <section id="aloqa" style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 4rem)", position: "relative", zIndex: 1, backgroundColor: "rgba(11, 17, 32, 0.8)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Asosiy Ko'nikmalar</h2>
            {SKILLS_DATA.map((skill, idx) => (
              <div key={idx} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
                  <span>{skill.name}</span>
                  <span style={{ color: "#3b82f6" }}>{skill.level}%</span>
                </div>
                <div style={{ height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", width: `${skill.level}%`, 
                    background: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)", borderRadius: "10px"
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "3rem 2rem", borderRadius: "20px", 
            border: "1px solid rgba(59,130,246,0.3)", textAlign: "center", backdropFilter: "blur(10px)",
            boxShadow: "0 0 40px rgba(59,130,246,0.1)"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚀</div>
            <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Loyiha bormi?</h3>
            <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.6 }}>
              VFX, animatsiya yoki murakkab simulyatsiya yaratish bo'yicha hamkorlik qilish uchun men bilan Telegram orqali bog'laning.
            </p>
            <a 
              href="https://t.me/khayotbe" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: "inline-block", padding: "1rem 2.5rem", backgroundColor: "#2AABEE", 
                color: "white", textDecoration: "none", borderRadius: "50px", fontWeight: 700, 
                fontSize: "1.1rem", transition: "0.3s", boxShadow: "0 10px 20px rgba(42, 171, 238, 0.4)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              @khayotbe
            </a>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: "2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#475569", fontSize: "0.9rem" }}>
          © 2026 Hayotbek VFX. Barcha huquqlar himoyalangan.
        </p>
      </footer>

    </div>
  );
};

export default App;