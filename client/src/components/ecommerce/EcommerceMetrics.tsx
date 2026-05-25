export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      {/*
       <div className="border-2 border-black bg-gray-300 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-400 border border-black dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div> */}
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="w-fit bg-gray-300 p-2 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-r-gray-700 border-b-gray-700">

        <div className="flex items-center justify-between bg-blue-900 border border-black px-2 py-1 mb-4">
          <span className="text-white font-bold text-sm">
            EXPERIENCE.TXT
          </span>

          <div className="flex gap-1">
            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              _
            </button>

            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              □
            </button>

            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              X
            </button>
          </div>
        </div>

        {/*} <div className="flex items-center justify-center w-12 h-12 bg-gray-400 border border-black dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div> */}
        <div className="w-[320px] md:w-[520px] xl:w-[1080px] h-[620px] overflow-y-auto bg-[#c0c0c0] border-t-2 border-l-2 border-t-gray-700 border-l-gray-700 border-r-2 border-b-2 border-r-white border-b-white p-4">

          <div className="text-black text-lg leading-relaxed space-y-4">

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <p>
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
            </p>

          </div>

        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
