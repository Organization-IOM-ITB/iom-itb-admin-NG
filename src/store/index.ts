import { createStore } from "vuex";
import auth from "./auth.module";
import activity from "./activity.module";
import merchandise from "./merchandise.module";
import member from "./member.module";
import transaction from "./transaction.module";
import upload from "./upload.module";
import danaBantuan from "./danaBantuan.module";
import pendataanAnggota from "./pendataanAnggota.module";
import pengajuanBantuan from "./pengajuanBantuan.module";
import orangtuaAsuh from "./orangtuaAsuh.module";
import donasi from "./donasi.module";
import donasiTally from "./donasiTally.module";
import fakultas from "./fakultas.module";
import appSelector from "./appSelector.module";
import kegiatanKemitraan from "./kegiatanKemitraan.module";
import kemitraan from "./kemitraan.module";
import dashboard from './dashboard.module';
import paymentDashboard from "./paymentDashboard.module";
import broadcast from "./broadcast.module";

export default createStore({
  modules: {
    auth,
    merchandise,
    member,
    activity,
    transaction,
    upload,
    danaBantuan,
    pendataanAnggota,
    pengajuanBantuan,
    orangtuaAsuh,
    donasi,
    donasiTally,
    fakultas,
    appSelector,
    kegiatanKemitraan,
    kemitraan,
    dashboard,
    paymentDashboard,
    broadcast,
  },
});
