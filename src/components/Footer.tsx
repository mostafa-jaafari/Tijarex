// components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-center text-sm text-black py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-blue-700">
            Jamla.ma
        </h2>

        <p className="text-gray-700 leading-loose">
          في jamla.ma، نؤمن بتمكين رواد الأعمال الطموحين لإطلاق علاماتهم التجارية في مجالي المكملات الغذائية والجمال، والوصول إلى إمكانيات لا حدود لها.
        </p>

        <div className="text-gray-800 font-semibold">
          Ste Space Seller SARL Capital de 100.000,00 DH &nbsp;|&nbsp;
          Adresse: N°130 Lot Moulay Drarga, Agadir<br />
          ICE: 003493860000058 &nbsp;|&nbsp; RC: 59201 &nbsp;|&nbsp; TP: 93102001 &nbsp;|&nbsp; IF: 65945852<br />
          Téléphone: +212 680 404 840
        </div>

        <div className="flex justify-center space-x-6 mt-4 text-gray-600">
          <Link href="/terms" className="hover:underline">الشروط العامة للبيع</Link>
          <Link href="/privacy" className="hover:underline">سياسة الخصوصية</Link>
        </div>

        <div className="text-gray-500 mt-6">
          .jamla.ma جميع الحقوق محفوظة © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
