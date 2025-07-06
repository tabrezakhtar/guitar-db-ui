import SideMenu from "./sidemenu/SideMenu";
import Grid from "./guitars/Grid";

function ContentContainer() {
  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full">
      <SideMenu />

      <main className="flex-1 bg-white p-4">
        <Grid />
      </main>
    </div>
  );
}

export default ContentContainer;