function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          <div className="text-white">
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
              Welcome to React App
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Build Something
              <span className="text-blue-200"> Amazing</span>
            </h1>

            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              Create modern, fast and beautiful web applications with React.
              Start building your next project today.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="/registration"
                className="bg-white text-blue-600 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </a>

              <a
                href="#features"
                className="border border-white/50 text-white px-7 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
              <div className="text-center text-white">
                <div className="text-7xl mb-4">⚛️</div>
                <h2 className="text-2xl font-bold">React</h2>
                <p className="text-blue-200 mt-2">
                  Modern Web Development
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto">
            <span className="text-blue-600 font-semibold">
              FEATURES
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Everything You Need
            </h2>

            <p className="text-gray-600 mt-4">
              Build powerful and responsive applications with modern
              development tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-14">

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                ⚡
              </div>

              <h3 className="text-xl font-bold mt-6">
                Fast Performance
              </h3>

              <p className="text-gray-600 mt-3">
                Build fast and responsive applications with modern React
                development.
              </p>
            </div>


            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                🎨
              </div>

              <h3 className="text-xl font-bold mt-6">
                Beautiful Design
              </h3>

              <p className="text-gray-600 mt-3">
                Create clean, modern and responsive user interfaces.
              </p>
            </div>


            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                🔒
              </div>

              <h3 className="text-xl font-bold mt-6">
                Secure
              </h3>

              <p className="text-gray-600 mt-3">
                Build scalable applications with a secure and reliable
                architecture.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl h-96 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-8xl">🚀</div>
              <h3 className="text-3xl font-bold mt-5">
                Let's Build
              </h3>
            </div>
          </div>

          <div>
            <span className="text-blue-600 font-semibold">
              ABOUT US
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Turn Your Ideas Into Reality
            </h2>

            <p className="text-gray-600 mt-6 leading-7">
              Our platform helps developers create modern web applications
              using React and the latest technologies.
            </p>

            <p className="text-gray-600 mt-4 leading-7">
              From simple websites to complex applications, you can build
              everything with a clean and scalable architecture.
            </p>

            <a
              href="/registration"
              className="inline-block mt-8 bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Account
            </a>
          </div>

        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">

          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Get Started?
          </h2>

          <p className="mt-5 text-blue-100 text-lg">
            Create your account today and start building something amazing.
          </p>

          <a
            href="/registration"
            className="inline-block mt-8 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Register Now
          </a>

        </div>
      </section>

    </div>
  )
}

export default Home