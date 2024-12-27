import React, { useEffect, useState } from "react";

const HorizontalScroll = (props) => {
  const [position, setPosition] = useState(0);
  const welcomeMessage = `Welcome to Home Page ${props.dynamicName} `;
  const fullMessage = welcomeMessage.repeat(10);

  const scrolledMessage =
    fullMessage.slice(position) + fullMessage.slice(0, position);

  useEffect(() => {
    const fun = () => {
      const interval = setInterval(() => {
        setPosition(
          (prevPosition) => (prevPosition + 1) % welcomeMessage.length
        );
      }, 70);

      return () => clearInterval(interval);
    };

    fun();
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center ">
        <div className="w-full max-w-3xl overflow-hidden">
          <div className="p-6">
            <div className="overflow-hidden whitespace-nowrap">
              <h1
                className="text-3xl md:text-4xl font-bold text-primary bg-white pt-5 pb-5"
                style={{
                  position: "fixed",
                  top: "94%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                  scrollBehavior: "smooth",
                }}
              >
                {scrolledMessage}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
