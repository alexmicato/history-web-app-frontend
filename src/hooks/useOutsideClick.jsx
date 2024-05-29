import { useEffect } from 'react';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    // This function checks if the click was outside the ref
    const handleClickOutside = (event) => {
      // Ensure the element is still in the document
      if (ref.current && document.body.contains(ref.current) && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]); // Dependency array to re-run the effect when ref or callback changes
};

export default useOutsideClick;
