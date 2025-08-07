import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";

/** Dashboard Component **/
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="my-5">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={3}>
          <Card className="dashboard-card h-100">
            <Card.Body className="text-center">
              <h5>Profile</h5>
              <p>View and update your profile information</p>
              <Button variant="primary" onClick={() => navigate("/profile")}>
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
        {user?.role === "MEMBER" && (
          <Col md={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <h5>Member Dashboard</h5>
                <p>Access member-specific features and services</p>
                <Button variant="success" onClick={() => navigate("/member")}>
                  Member Area
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        {user?.role === "TRAINER" && (
          <Col md={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <h5>Trainer Dashboard</h5>
                <p>Manage training sessions and member progress</p>
                <Button variant="success" onClick={() => navigate("/trainer")}>
                  Trainer Area
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        {user?.role === "STAFF" && (
          <Col md={3}>
            <Card className="dashboard-card h-100">
              <Card.Body className="text-center">
                <h5>Staff Dashboard</h5>
                <p>Handle gym operations and member services</p>
                <Button variant="warning" onClick={() => navigate("/staff")}>
                  Staff Area
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        {user?.role === "ADMIN" && (
          <Col md={3} >
            <Card className="dashboard-card h-100" >
              <Card.Body className="text-center">
                <h5>Admin Dashboard</h5>
                <p>Full system administration and management</p>
                <Button variant="danger" onClick={() => navigate("/admin")}>
                  Admin Area
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

/** Landing page sections modularized **/

const Header = () => (
  <header className="header fixed-top bg-white shadow-sm py-2">
    <div className="container d-flex justify-content-between align-items-center">
      <a href="#" className="d-flex align-items-center text-decoration-none">
        <ion-icon
          name="barbell-sharp"
          style={{
            color: "#f44336",
            fontSize: 40,
            transform: "rotate(90deg) translate(-2px, -5px)",
          }}
          aria-hidden="true"
        />
        <span
          className="ms-2 fw-bold"
          style={{ fontFamily: "'Catamaran', sans-serif", fontSize: "2.8rem", color: "#152947" }}
        >
          Fitlife
        </span>
      </a>

      <nav className="d-none d-lg-block">
        <ul className="nav">
          {["Home", "About Us", "Classes", "Blog", "Contact Us"].map((text, idx) => (
            <li key={idx} className="nav-item">
              <a
                href={`#${text.toLowerCase().replace(" ", "")}`}
                className={`nav-link px-3 ${idx === 0 ? "active fw-bold" : ""}`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a href="/register" className="btn btn-outline-danger d-none d-lg-inline-block text-uppercase px-4 fw-semibold">
        Join Now
      </a>
    </div>
  </header>
);

const Hero = () => (
  <section
    id="home"
    aria-label="hero"
    className="position-relative bg-dark text-white overflow-hidden"
    style={{
      backgroundImage: "url('/assets/images/hero-bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top left",
      paddingTop: "160px",
      paddingBottom: 0,
    }}
  >
    <div
      className="container d-lg-grid"
      style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}
    >
      <div className="text-center text-lg-start mb-5 mb-lg-0">
        <p
          className="d-inline-block bg-white-10 text-danger py-1 px-3 rounded text-uppercase fw-bold fs-5"
          style={{ fontFamily: "'Catamaran', sans-serif", letterSpacing: "1px" }}
        >
          <strong className="bg-danger px-3 rounded me-3">The Best</strong>Fitness Club
        </p>

        <h1 className="display-1 fw-bold mt-3" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Work Hard To Get Better Life
        </h1>

        <p
          className="lead text-secondary my-4"
          style={{ maxWidth: "450px", marginLeft: "auto", marginRight: "auto", marginLeft: 0 }}
        >
          Duis mollis felis quis libero dictum vehicula. Duis dictum lorem mi, a faucibus nisi eleifend eu.
        </p>

        <a href="/register" className="btn btn-danger btn-lg text-uppercase fw-semibold">
          Get Started
        </a>
      </div>

      <div className="position-relative mx-auto" style={{ maxWidth: 660 }}>
        <img
          src="/assets/images/hero-banner.png"
          alt="hero banner"
          width="660"
          height="753"
          className="img-fluid"
        />

        <img
          src="/assets/images/hero-circle-one.png"
          className="position-absolute top-50 start-50 translate-middle rounded-circle"
          alt=""
          aria-hidden="true"
          style={{
            width: "666px",
            height: "666px",
            zIndex: -1,
            animation: "rotate360 15s linear infinite",
          }}
        />
        <img
          src="/assets/images/hero-circle-two.png"
          className="position-absolute top-50 start-50 translate-middle rounded-circle"
          alt=""
          aria-hidden="true"
          style={{
            width: "666px",
            height: "666px",
            zIndex: -2,
            animation: "rotate360Reverse 15s linear infinite",
          }}
        />
        <img
          src="/assets/images/heart-rate.svg"
          alt="heart rate"
          className="position-absolute"
          style={{
            top: 20,
            right: "-50px",
            width: 190,
            animation: "move 3s linear infinite alternate",
          }}
        />
        <img
          src="/assets/images/calories.svg"
          alt="calories"
          className="position-absolute"
          style={{
            bottom: -50,
            left: "-40px",
            width: 280,
            animation: "moveReverse 3s linear infinite alternate",
          }}
        />
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="aboutus" aria-label="about" className="section about py-5">
    <div
      className="container d-lg-grid"
      style={{ gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
    >
      <div className="about-banner position-relative mb-4 mb-lg-0">
        <img
          src="/assets/images/about-banner.png"
          width="660"
          height="648"
          loading="lazy"
          alt="about banner"
          className="img-fluid rounded"
        />

        <img
          src="/assets/images/about-circle-one.png"
          width="660"
          height="534"
          loading="lazy"
          aria-hidden="true"
          alt=""
          className="position-absolute top-50 start-0 translate-middle-y rounded-circle"
          style={{ width: 200, height: 200, zIndex: -1, opacity: 0.3 }}
        />

        <img
          src="/assets/images/about-circle-two.png"
          width="660"
          height="534"
          loading="lazy"
          aria-hidden="true"
          alt=""
          className="position-absolute top-100 start-50 translate-middle-x rounded-circle"
          style={{ width: 200, height: 200, zIndex: -1, opacity: 0.3 }}
        />

        <img
          src="/assets/images/fitness.png"
          width="650"
          height="154"
          loading="lazy"
          alt="fitness"
          className="position-absolute bottom-0 start-0 w-100"
          style={{ zIndex: -2 }}
        />
      </div>

      <div className="about-content">
        <p
          className="section-subtitle text-danger text-uppercase fw-bold mb-2"
          style={{ fontFamily: "'Catamaran', sans-serif" }}
        >
          About Us
        </p>

        <h2 className="h2 section-title mb-4" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Welcome To Our Fitness Gym
        </h2>

        <p className="section-text mb-3" style={{ color: "#666" }}>
          Nam ut hendrerit leo. Aenean vel ipsum nunc. Curabitur in tellus vitae nisi aliquet dapibus non et erat.
          Pellentesque porta sapien non accumsan dignissim curabitur sagittis nulla sit amet dolor feugiat.
        </p>

        <p className="section-text mb-4" style={{ color: "#666" }}>
          Integer placerat vitae metus posuere tincidunt. Nullam suscipit ante ac aliquet viverra vestibulum ante ipsum
          primis.
        </p>

        <div className="d-flex align-items-center gap-3 mb-4">
          <figure className="coach-avatar rounded-circle overflow-hidden" style={{ width: 65, height: 65 }}>
            <img
              src="/assets/images/about-coach.jpg"
              width="65"
              height="65"
              loading="lazy"
              alt="Trainer"
              className="img-fluid rounded-circle"
            />
          </figure>

          <div>
            <h3 className="h3 coach-name mb-1 fw-bold">Denis Robinson</h3>
            <p className="coach-title text-muted mb-0">Our Coach</p>
          </div>
        </div>

        <a href="#about" className="btn btn-danger text-uppercase px-4 fw-semibold">
          Explore More
        </a>
      </div>
    </div>
  </section>
);

const Video = () => (
  <section className="section video py-5" aria-label="video">
    <div className="container d-flex justify-content-center">
      <div
        className="video-card rounded position-relative d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{
          backgroundImage: "url('/assets/images/video-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          width: "100%",
          maxWidth: 960,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(21, 41, 71, 0.5)",
            zIndex: 0,
          }}
        />

        <h2
          className="card-title fw-bold"
          style={{ fontSize: "3rem", position: "relative", zIndex: 1, fontFamily: "'Catamaran', sans-serif" }}
        >
          Explore Fitness Life
        </h2>

        <button
          className="play-btn btn btn-danger rounded-circle shadow-none position-relative"
          aria-label="play video"
          style={{ width: 80, height: 80, fontSize: 30, zIndex: 1, margin: "25px 0 35px" }}
        >
          <ion-icon name="play-sharp" aria-hidden="true" style={{ fontSize: 28 }}></ion-icon>
        </button>

        <a href="https://www.youtube.com/shorts/mnnd03RAWic" className="btn-link btn btn-outline-light text-uppercase fw-semibold position-relative" style={{ zIndex: 1 }}>
          Watch More
        </a>
      </div>
    </div>
  </section>
);

const Classes = () => {
  const classesList = [
    {
      img: "class-1.jpg",
      alt: "Weight Lifting",
      icon: "class-icon-1.png",
      title: "Weight Lifting",
      text: "Suspendisse nisi libero, cursus ac magna sit amet, fermentum imperdiet nisi.",
      progress: 85,
    },
    {
      img: "class-2.jpg",
      alt: "Cardio & Strenght",
      icon: "class-icon-2.png",
      title: "Cardio & Strenght",
      text: "Suspendisse nisi libero, cursus ac magna sit amet, fermentum imperdiet nisi.",
      progress: 70,
    },
    {
      img: "class-3.jpg",
      alt: "Power Yoga",
      icon: "class-icon-3.png",
      title: "Power Yoga",
      text: "Suspendisse nisi libero, cursus ac magna sit amet, fermentum imperdiet nisi.",
      progress: 90,
    },
    {
      img: "class-4.jpg",
      alt: "The Fitness Pack",
      icon: "class-icon-4.png",
      title: "The Fitness Pack",
      text: "Suspendisse nisi libero, cursus ac magna sit amet, fermentum imperdiet nisi.",
      progress: 60,
    },
  ];

  return (
    <section
      id="classes"
      aria-label="class"
      className="section class py-5 text-white"
      style={{ backgroundImage: "url('/assets/images/classes-bg.png')", backgroundRepeat: "no-repeat", backgroundPosition: "top left" }}
    >
      <Container>
        <p className="section-subtitle text-danger text-uppercase fw-bold mb-2" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Our Classes
        </p>

        <h2 className="section-title text-center mb-5 fw-bold" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Fitness Classes For Every Goal
        </h2>

        <Row className="g-4 justify-content-center">
          {classesList.map(({ img, alt, icon, title, text, progress }) => (
            <Col key={title} xs={12} md={6} lg={4}>
              <div className="class-card bg-white rounded h-100 shadow-sm d-flex flex-column">
                <figure className="card-banner img-holder position-relative" style={{ overflow: "hidden" }}>
                  <img src={`/assets/images/${img}`} alt={alt} className="img-fluid" style={{ transition: "transform 0.5s ease" }} />
                </figure>

                <div className="card-content p-3 flex-grow-1 d-flex flex-column">
                  <div className="title-wrapper d-flex align-items-center mb-3 border-bottom border-2 border-light pb-2">
                    <img src={`/assets/images/${icon}`} alt="" aria-hidden="true" width={52} height={52} className="me-3" />
                    <h3 className="h4 card-title mb-0">
                      <a href="#class" className="text-decoration-none text-dark fw-bold">
                        {title}
                      </a>
                    </h3>
                  </div>

                  <p className="card-text text-muted flex-grow-1">{text}</p>

                  <div className="card-progress mt-auto">
                    <div className="progress-wrapper d-flex justify-content-between align-items-center mb-2 fw-bold" style={{ fontFamily: "'Catamaran', sans-serif" }}>
                      <p className="mb-0 text-dark">Class Full</p>
                      <span>{progress}%</span>
                    </div>

                    <div className="progress" style={{ height: 10, borderRadius: 50 }}>
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: `${progress}%`, borderRadius: 50 }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const Blog = () => {
  const blogPosts = [
    {
      image: "blog-1.jpg",
      alt: "Going to the gym for the first time",
      date: "2022-07-07",
      title: "Going to the gym for the first time",
      text:
        "Praesent id ipsum pellentesque lectus dapibus condimentum curabitur eget risus quam. In hac habitasse platea dictumst.",
    },
    {
      image: "blog-2.jpg",
      alt: "Parturient accumsan cacus pulvinar magna",
      date: "2022-07-07",
      title: "Parturient accumsan cacus pulvinar magna",
      text:
        "Praesent id ipsum pellentesque lectus dapibus condimentum curabitur eget risus quam. In hac habitasse platea dictumst.",
    },
    {
      image: "blog-3.jpg",
      alt: "Risus purus namien parturient accumsan cacus",
      date: "2022-07-07",
      title: "Risus purus namien parturient accumsan cacus",
      text:
        "Praesent id ipsum pellentesque lectus dapibus condimentum curabitur eget risus quam. In hac habitasse platea dictumst.",
    },
  ];

  return (
    <section id="blog" aria-label="blog" className="section blog py-5">
      <Container>
        <p className="section-subtitle text-danger text-uppercase fw-bold mb-2" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Our News
        </p>

        <h2 className="section-title text-center mb-5 fw-bold" style={{ fontFamily: "'Catamaran', sans-serif" }}>
          Latest Blog Feed
        </h2>

        <Row className="g-4 justify-content-center">
          {blogPosts.map(({ image, alt, date, title, text }) => (
            <Col xs={12} md={6} lg={4} key={title}>
              <article className="blog-card bg-white border rounded h-100 shadow-sm d-flex flex-column">
                <div className="card-banner position-relative overflow-hidden">
                  <img
                    src={`/assets/images/${image}`}
                    alt={alt}
                    className="img-fluid"
                    style={{ transition: "transform 0.5s ease" }}
                  />
                  <time
                    className="card-meta bg-danger text-white position-absolute bottom-0 start-0 px-3 py-1 text-uppercase"
                    dateTime={date}
                    style={{ fontFamily: "'Catamaran', sans-serif", fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    {new Date(date).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <div className="card-content p-4 d-flex flex-column flex-grow-1">
                  <h3 className="h4 card-title mb-3">
                    <a href="#blog" className="text-decoration-none text-dark fw-bold">
                      {title}
                    </a>
                  </h3>

                  <p className="card-text text-muted flex-grow-1">{text}</p>

                  <a href="#blog" className="btn-link btn btn-outline-danger text-uppercase fw-semibold mt-3 align-self-start">
                    Read More
                  </a>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const Footer = () => (
  <footer className="footer bg-dark text-light pt-5">
    <div
      className="section footer-top bg-dark has-bg-image"
      style={{
        backgroundImage: "url('/assets/images/footer-bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
      }}
    >
      <div className="container d-lg-grid" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2rem" }}>
        <div className="footer-brand">
          <a href="#" className="d-flex align-items-center text-light text-decoration-none mb-3">
            <ion-icon
              name="barbell-sharp"
              style={{
                color: "#f44336",
                fontSize: 40,
                transform: "rotate(90deg) translate(-2px, -5px)",
              }}
              aria-hidden="true"
            />
            <span className="ms-2 fw-bold" style={{ fontFamily: "'Catamaran', sans-serif", fontSize: "2.8rem" }}>
              Fitlife
            </span>
          </a>

          <p className="footer-brand-text text-muted mb-4" style={{ maxWidth: 300 }}>
            Etiam suscipit fringilla ullamcorper sed malesuada urna nec odio.
          </p>

          <div className="d-flex align-items-start gap-3">
            <img src="/assets/images/footer-clock.png" width="34" height="34" loading="lazy" alt="Clock" />
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <p className="mb-0 fw-bold">Monday - Friday</p>
                <p className="mb-0" style={{ color: "#ccc" }}>
                  7:00Am - 10:00Pm
                </p>
              </li>
              <li>
                <p className="mb-0 fw-bold">Saturday - Sunday</p>
                <p className="mb-0" style={{ color: "#ccc" }}>
                  7:00Am - 2:00Pm
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <p
            className="footer-list-title text-danger fw-bold mb-4"
            style={{ fontFamily: "'Catamaran', sans-serif", fontSize: "1.5rem" }}
          >
            Our Links
          </p>
          <ul className="list-unstyled">
            {["Home", "About Us", "Classes", "Blog", "Contact Us"].map((text, idx) => (
              <li key={idx} className="mb-2">
                <a href="#footer" className="footer-link text-light text-decoration-none">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="contactus">
          <p
            className="footer-list-title text-danger fw-bold mb-4"
            style={{ fontFamily: "'Catamaran', sans-serif", fontSize: "1.5rem" }}
          >
            Contact Us
          </p>
          <ul className="list-unstyled">
            <li className="footer-list-item d-flex align-items-center mb-3 gap-3">
              <div
                className="icon bg-danger rounded-circle d-flex justify-content-center align-items-center text-white"
                style={{ width: 32, height: 32 }}
              >
                <ion-icon name="location" aria-hidden="true" style={{ fontSize: 18 }}></ion-icon>
              </div>
              <address className="address footer-link mb-0" style={{ fontStyle: "normal" }}>
                1247/Plot No. 39, 15th Phase, Colony, Kukatpally, Hyderabad
              </address>
            </li>
            <li className="footer-list-item d-flex align-items-center mb-3 gap-3">
              <div
                className="icon bg-danger rounded-circle d-flex justify-content-center align-items-center text-white"
                style={{ width: 32, height: 32 }}
              >
                <ion-icon name="call" aria-hidden="true" style={{ fontSize: 18 }}></ion-icon>
              </div>
              <div>
                <a href="tel:18001213637" className="footer-link d-block text-light text-decoration-none">
                  1800-121-3637
                </a>
                <a href="tel:+915552348765" className="footer-link d-block text-light text-decoration-none">
                  +91 555 234-8765
                </a>
              </div>
            </li>
            <li className="footer-list-item d-flex align-items-center gap-3">
              <div
                className="icon bg-danger rounded-circle d-flex justify-content-center align-items-center text-white"
                style={{ width: 32, height: 32 }}
              >
                <ion-icon name="mail" aria-hidden="true" style={{ fontSize: 18 }}></ion-icon>
              </div>
              <div>
                <a href="mailto:info@fitlife.com" className="footer-link d-block text-light text-decoration-none">
                  info@fitlife.com
                </a>
                <a href="mailto:services@fitlife.com" className="footer-link d-block text-light text-decoration-none">
                  services@fitlife.com
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <p
            className="footer-list-title text-danger fw-bold mb-4"
            style={{ fontFamily: "'Catamaran', sans-serif", fontSize: "1.5rem" }}
          >
            Our Newsletter
          </p>
          <form action="" className="footer-form position-relative mb-4">
            <input
              type="email"
              name="email_address"
              aria-label="email"
              placeholder="Email Address"
              required
              className="form-control rounded-pill pe-5"
              style={{ paddingRight: "3rem" }}
            />
            <button
              type="submit"
              className="btn btn-danger position-absolute top-50 end-0 translate-middle-y rounded-pill"
              aria-label="Submit"
              style={{ width: 40, height: 40, padding: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <ion-icon name="chevron-forward-sharp" aria-hidden="true" style={{ fontSize: 20, color: "#fff" }}></ion-icon>
            </button>
          </form>
          <ul className="social-list d-flex gap-3 list-unstyled">
            <li>
              <a href="#facebook" className="social-link d-inline-block bg-white-20 text-white p-3 rounded-circle text-decoration-none">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#instagram" className="social-link d-inline-block bg-white-20 text-white p-3 rounded-circle text-decoration-none">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
            <li>
              <a href="#twitter" className="social-link d-inline-block bg-white-20 text-white p-3 rounded-circle text-decoration-none">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-bottom bg-rich-black-fogra-29-2 text-center text-light py-3 mt-4">
      <div className="container d-lg-flex justify-content-between align-items-center">
        <p className="mb-2 mb-lg-0" style={{ fontSize: "0.9rem" }}>
          &copy; 2023. Developed by{" "}
          <a href="https://www.cdac.in/" className="copyright-link text-danger text-decoration-none">
            CDAC
          </a>
          . All Rights Reserved.
        </p>

        <ul className="footer-bottom-list list-unstyled d-flex justify-content-center gap-3 mb-0">
          <li>
            <a href="#privacy" className="footer-bottom-link text-light text-decoration-none position-relative ps-3">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#terms" className="footer-bottom-link text-light text-decoration-none position-relative ps-3">
              Terms & Condition
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

/** Main Home Component **/
const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Video />
        <Classes />
        <Blog />
      </main>
      <Footer />

      {/* Custom global styles and animations */}
      <style>
        {`
          :root {
            --rich-black-fogra-29_50: rgba(21, 41, 71, 0.5);
            --rich-black-fogra-29-1: #152947;
            --rich-black-fogra-29-2: #0d1d2b;
            --silver-metallic: #a9a9a9;
            --coquelicot_20: rgba(244, 67, 54, 0.2);
            --coquelicot_10: rgba(244, 67, 54, 0.1);
            --sonic-silver: #737373;
            --cadet-gray: #9ca3af;
            --light-gray: #cccccc;
            --coquelicot: #f44336;
            --gainsboro: #dedede;
            --white_20: rgba(255, 255, 255, 0.2);
            --white_10: rgba(255, 255, 255, 0.1);
            --black_10: rgba(0, 0, 0, 0.1);
            --white: #ffffff;
          }

          .bg-white-10 {
            background-color: var(--white_10);
          }
          .bg-danger {
            background-color: var(--coquelicot) !important;
          }
          .text-danger {
            color: var(--coquelicot) !important;
          }

          .btn-danger {
            background-color: var(--coquelicot);
            border-color: var(--coquelicot);
          }
          .btn-danger:hover, 
          .btn-danger:focus {
            background-color: var(--rich-black-fogra-29-1);
            border-color: var(--rich-black-fogra-29-1);
            color: white;
            box-shadow: none;
          }

          @keyframes rotate360 {
            0% { transform: translate(-50%, -56%) rotate(0); }
            100% { transform: translate(-50%, -56%) rotate(1turn); }
          }
          @keyframes rotate360Reverse {
            0% { transform: translate(-50%, -56%) rotate(0); }
            100% { transform: translate(-50%, -56%) rotate(-1turn); }
          }
          @keyframes move {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-5px, 10px); }
            100% { transform: translate(5px, 20px); }
          }
          @keyframes moveReverse {
            0% { transform: translate(0, 0); }
            50% { transform: translate(5px, -10px); }
            100% { transform: translate(-5px, -20px); }
          }
        `}
      </style>
    </>
  );
};

export default Home;
