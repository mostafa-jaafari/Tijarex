import { getTranslations } from "next-intl/server"
import Link from "next/link";

export async function LastCallToAction() {
    const t = await getTranslations("lastcalltoaction");
    return (
        <section className="w-full bg-blue-600 md:py-20 lg:py-30 py-10 flex flex-col items-center">
            <div className="text-white flex flex-col items-center lg:w-3/4 px-6 gap-4">
                <b className="text-xl font-bold text-blue-200">
                    | {t("title")} |
                </b>
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-center leading-snug">
                    {t("description1")}
                </h1>
                <p className="lg:text-xl md:text-lg text-blue-100 text-center mt-2 max-w-2xl">
                    {t("description2")}
                </p>
                <Link
                    href="/auth/register"
                    className="cursor-pointer bg-gradient-to-r 
                        from-blue-600 via-blue-500 to-blue-400
                        hover:to-blue-200 transition px-6 py-2
                        rounded-full border border-blue-400 shadow-xl 
                        shadow-blue-700/20 text-white text-lg font-semibold"
                >
                    {t("button")}
                </Link>
            </div>
        </section>
    );
}
