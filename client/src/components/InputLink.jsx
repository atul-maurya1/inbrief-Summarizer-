import { IoIosLink } from "react-icons/io";


const InputLink = () => {

  
  return (
    <div className="w-full py-10">
      <div
        className="w-full p-6 sm:p-8
                   border-2 border-dashed border-slate-300
                   rounded-2xl bg-slate-50
                   hover:border-blue-400 transition"
      >
        <div
          className="w-14 h-14 mx-auto mb-4
                     flex items-center justify-center
                     rounded-xl bg-blue-50"
        >
          <IoIosLink size={28} className="text-blue-500" />
        </div>

        <h3 className="text-base font-semibold text-slate-700 text-center">
          Add a YouTube or Website Link
        </h3>

        <p className="mt-1 text-sm text-slate-400 text-center">
          Paste a URL to add content
        </p>

        {/* URL Input */}
        <div className="relative mt-6">
          <IoIosLink
            size={20}
            className="absolute left-3 top-1/2
                       -translate-y-1/2 text-slate-400"
          />

          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="w-full h-12 pl-10 pr-4
                       border border-slate-200
                       rounded-xl bg-white
                       text-sm text-slate-700
                       placeholder:text-slate-400
                       outline-none
                       focus:border-blue-500
                       focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

     <div className="py-5">
           <button
          type="button"
          className="w-full mt-4 h-12
                     rounded-xl bg-blue-600
                     hover:bg-blue-700
                     text-white text-sm font-medium
                     transition"
        >
          Add Link
        </button>
     </div>

      </div>

    </div>
  );
};

export default InputLink;