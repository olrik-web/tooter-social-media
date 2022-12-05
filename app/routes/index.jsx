import Button from "../components/Button";
import logo from "../images/dall-e-elephant.png";

export default function Index() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-24">
        <img className="w-52" src={logo} alt="Logo" />
        <h1 className="text-3xl font-bold p-4">Save and organize your code snippets in the cloud</h1>
        <p className="text-xl pt-4">
          Snip Elephant lets you save code you find across the Web and quickly access it on all devices
        </p>
        <p className="py-8">Get started for free</p>
        <span>
          <Button path="login" classType="primary">
            Log in
          </Button>

          <span className="px-4">or</span>
          <Button path="signup">
            Sign up
          </Button>
        </span>
      </div>
    </div>
  );
}
