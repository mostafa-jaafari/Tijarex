import { getTranslations } from "next-intl/server"





export async function LastCallToAction() {
    const t = await getTranslations("lastcalltoaction");
    return (
        <section className="w-full bg-blue-600 md:py-20 lg:py-30 py-10 flex flex-col items-center">
            <div
                className="text-white flex flex-col items-center lg:w-3/4 px-6 gap-4"
            >
                <b className="text-xl font-bold text-blue-200">
                    | {t("title")} |
                </b>
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-center">
                    {t("description1")}
                </h1>
                <p
                    className="lg:text-xl md:text-xl text-blue-100 text-center mt-2"
                >
                    {t("description2")}
                </p>
                <button
                    className="hover:bg-neutral-200 cursor-pointer mt-4 px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
                >
                    {t("button")}
                </button>
            </div>
        </section>
    )
}