import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

function MainLayout({children}) {
    return (
        <main className="flex flex-col min-h-screen">
            <section className="flex-grow h-full bg-background">
                <Header/>
                {children}
                <Footer/>
            </section>
        </main>
    )
}

export default MainLayout;
