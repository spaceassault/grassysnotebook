import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";
import { Progress } from "./ui/progress";

function ProgressBar() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (navigation.state === "submitting" || navigation.state === "loading") {
      setProgress(10); // Start the progress bar at 10% when loading starts
      setVisible(true); // Show the progress bar

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 10; // Increment progress while loading
          } else {
            return prev;
          }
        });
      }, 500);
    } else if (navigation.state === "idle") {
      setProgress(100); // Complete the progress bar when loading ends

      // Hide the progress bar after it reaches 100%
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);
    }

    return () => {
      clearInterval(timer); // Clear the interval on component unmount
    };
  }, [navigation.state]);

  return (
    <div className={`fixed top-0 left-0 w-full h-2 z-50 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Progress value={progress} className="w-full h-full transition-all duration-500" />
    </div>
  );
}

export default ProgressBar;
