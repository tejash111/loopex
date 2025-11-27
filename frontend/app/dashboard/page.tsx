'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { detectCategories, getBorderColor } from '@/utils/inputDetector'
import UploadJDModal from '@/components/dashboard/UploadJDModal'

const newProjectIcon = <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
  <path d="M6.15945 0.179129C5.6803 -0.000548769 5.14654 -0.000308799 4.37448 2.87006e-05C3.71543 2.12006e-05 3.05404 5.12945e-05 2.62478 0.0378888C2.18247 0.0768813 1.79541 0.159344 1.44194 0.356609C0.986498 0.610769 0.61071 0.986564 0.35655 1.44199C0.159285 1.79547 0.0768152 2.18253 0.0378302 2.62483C-7.32858e-06 3.0541 -7.29317e-06 3.58564 2.06826e-07 4.24468V6.60561C-7.29317e-06 8.33691 -1.48192e-05 9.69366 0.142313 10.7523C0.287993 11.8358 0.591998 12.6909 1.26311 13.362C1.93421 14.0331 2.78923 14.3371 3.87278 14.4828C4.93139 14.6251 6.28817 14.6251 8.01945 14.6251H9.03172C9.6438 14.6251 10.1932 14.6251 10.6875 14.6163V12.5625H9.375C8.44305 12.5625 7.6875 11.807 7.6875 10.875C7.6875 9.94303 8.44305 9.18748 9.375 9.18748H10.6875V7.87498C10.6875 6.94303 11.4431 6.18748 12.375 6.18748C13.3069 6.18748 14.0625 6.94303 14.0625 7.87498V9.18748H16.1162C16.125 8.69316 16.125 8.14386 16.125 7.53178C16.125 6.76753 16.125 6.08916 16.0748 5.59468C16.0228 5.08426 15.9127 4.6416 15.651 4.25002C15.4458 3.94292 15.1822 3.67925 14.8751 3.47405C14.4835 3.21241 14.0408 3.10227 13.5304 3.05035C13.0359 3.00004 12.4196 3.00005 11.6554 3.00006H8.98958C8.7525 3.00006 8.6172 2.99937 8.5173 2.98904C8.4408 2.98369 8.3886 2.92697 8.3721 2.89928C8.31818 2.81458 8.12535 2.42938 8.01937 2.21733C7.6653 1.50097 7.20607 0.571596 6.15945 0.179129Z" fill="#A0A0AB"/>
</svg>

const allProjectsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
  <path d="M6.15945 0.17913C5.6803 -0.000547886 5.14654 -0.000315414 4.37448 2.95864e-05C3.71543 2.20864e-05 3.05404 4.467e-05 2.62478 0.0378822C2.18247 0.0768747 1.79541 0.159345 1.44194 0.356602C0.986498 0.610762 0.61071 0.986557 0.35655 1.44199C0.159285 1.79547 0.0768152 2.18253 0.0378302 2.62483C-7.32858e-06 3.05409 -7.29317e-06 3.58563 2.06826e-07 4.24468V6.60556C-7.29317e-06 8.33686 -1.48192e-05 9.69369 0.142313 10.7523C0.287993 11.8358 0.591998 12.6908 1.26311 13.3619C1.93421 14.033 2.78923 14.3371 3.87278 14.4827C4.93139 14.6251 6.28817 14.6251 8.01945 14.6251H8.4375V9.37501C8.4375 8.44299 9.19305 7.68751 10.125 7.68751H16.125C16.125 7.63606 16.125 7.58416 16.125 7.53174C16.125 6.76749 16.125 6.08919 16.0748 5.59467C16.0228 5.08425 15.9127 4.6416 15.651 4.25002C15.4458 3.94292 15.1822 3.67924 14.8751 3.47405C14.4835 3.21241 14.0408 3.10227 13.5304 3.05035C13.0359 3.00004 12.4196 3.00005 11.6554 3.00006H8.98958C8.7525 3.00006 8.6172 2.99936 8.5173 2.98904C8.4408 2.98369 8.3886 2.92697 8.3721 2.89928C8.31818 2.81458 8.12535 2.42937 8.01937 2.21732C7.6653 1.50097 7.20607 0.571597 6.15945 0.17913Z" fill="#A0A0AB"/>
</svg>

const projectIcon = <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
  <path d="M4.37448 2.87006e-05C5.14654 -0.000308799 5.6803 -0.000548769 6.15945 0.179129C7.20607 0.571596 7.6653 1.50097 8.01937 2.21733C8.12535 2.42938 8.31818 2.81458 8.3721 2.89928C8.3886 2.92697 8.4408 2.98369 8.5173 2.98904C8.6172 2.99937 8.7525 3.00006 8.98958 3.00006H11.6554C12.4196 3.00005 13.0359 3.00004 13.5304 3.05035C14.0408 3.10227 14.4835 3.21241 14.8751 3.47405C15.1822 3.67925 15.4458 3.94292 15.651 4.25002C15.9127 4.6416 16.0228 5.08426 16.0748 5.59468C16.125 6.08916 16.125 6.76753 16.125 7.53178C16.125 8.82156 16.125 9.83271 16.0431 10.6378C15.9596 11.4588 15.7862 12.1277 15.3983 12.7084C15.0836 13.1794 14.6793 13.5836 14.2084 13.8983C13.6277 14.2863 12.9587 14.4597 12.1377 14.5432C11.3326 14.6251 10.3215 14.6251 9.03172 14.6251H8.01945C6.28817 14.6251 4.93139 14.6251 3.87278 14.4828C2.78923 14.3371 1.93421 14.0331 1.26311 13.362C0.591998 12.6909 0.287993 11.8358 0.142313 10.7523C-1.48192e-05 9.69366 -7.28884e-06 8.33691 2.11162e-07 6.60561V4.24469C-7.28884e-06 3.58564 -1.4822e-05 3.0541 0.0378302 2.62483C0.0768152 2.18253 0.159285 1.79547 0.35655 1.44199C0.61071 0.986564 0.986498 0.610769 1.44194 0.356609C1.79541 0.159344 2.18247 0.0768813 2.62478 0.0378888C3.05404 5.12945e-05 3.71543 2.12006e-05 4.37448 2.87006e-05Z" fill="currentColor"/>
</svg>

const generalLinks = [
  { label: 'Shortlist', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M5.43383 9.71212C2.85767 10.3085 0.9375 12.6175 0.9375 15.375C0.9375 15.6856 1.18934 15.9375 1.5 15.9375H12C12.3106 15.9375 12.5625 15.6856 12.5625 15.375C12.5625 12.6175 10.6424 10.3085 8.06617 9.71212C9.59355 9.17055 10.6875 7.71308 10.6875 6C10.6875 3.82538 8.92462 2.0625 6.75 2.0625C4.57538 2.0625 2.8125 3.82538 2.8125 6C2.8125 7.71308 3.90643 9.17055 5.43383 9.71212Z" fill="#A0A0AB"/>
  <path d="M16.9778 6.4037C17.1691 6.77108 17.0264 7.224 16.659 7.41534C15.93 7.79505 15.2288 8.6022 14.6811 9.40088C14.4162 9.7872 14.2035 10.1472 14.0572 10.4104C13.9842 10.5416 13.8758 10.7525 13.8387 10.8247C13.7205 11.0708 13.4777 11.2335 13.2051 11.249C12.9323 11.2644 12.6727 11.1304 12.5274 10.8991C12.3728 10.6528 12.1179 10.4163 11.8677 10.2279C11.7479 10.1378 11.5314 10.0017 11.4546 9.95385C11.0908 9.75608 10.9559 9.30075 11.1535 8.93685C11.3512 8.5728 11.8065 8.43803 12.1706 8.63573C12.3377 8.72648 12.6085 8.90805 12.77 9.02963C12.8455 9.08655 12.9274 9.15113 13.0123 9.22298C13.1367 9.0174 13.2813 8.78985 13.444 8.55255C14.0214 7.7106 14.8952 6.64277 15.9661 6.08497C16.3335 5.89363 16.7864 6.03633 16.9778 6.4037Z" fill="#A0A0AB"/>
</svg> },
  { label: 'Email Automation', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0117 2.0901C9.54487 2.05329 8.45513 2.0533 6.98828 2.0901L6.93214 2.09151C5.80012 2.11989 4.86871 2.14323 4.11798 2.27381C3.32121 2.4124 2.65407 2.6823 2.08902 3.2488C1.52692 3.81233 1.25779 4.46895 1.12144 5.25312C0.993487 5.98903 0.974122 6.89717 0.950684 7.99627L0.949477 8.05282C0.933502 8.80132 0.933509 9.19875 0.949492 9.94717L0.950699 10.0037C0.974129 11.1028 0.993494 12.0109 1.12145 12.7469C1.2578 13.531 1.52694 14.1877 2.08903 14.7512C2.65408 15.3177 3.32122 15.5876 4.11799 15.7262C4.86871 15.8568 5.80012 15.8801 6.93214 15.9085L6.98829 15.9099C8.45513 15.9467 9.54487 15.9467 11.0117 15.9099L11.0678 15.9085C12.1999 15.8801 13.1313 15.8567 13.882 15.7261C14.6788 15.5876 15.3459 15.3177 15.9109 14.7512C16.4731 14.1877 16.7422 13.531 16.8785 12.7468C17.0065 12.0109 17.0259 11.1028 17.0493 10.0037L17.0505 9.94717C17.0665 9.19867 17.0665 8.80132 17.0505 8.05282L17.0493 7.99635C17.0259 6.8972 17.0065 5.98903 16.8785 5.25312C16.7422 4.46895 16.4731 3.81233 15.9109 3.2488C15.5935 2.93046 15.2437 2.70577 14.8567 2.54541C14.7979 2.51328 14.7348 2.48904 14.669 2.47358C14.4217 2.38638 14.1597 2.32212 13.882 2.27382C13.1313 2.14323 12.1999 2.11989 11.0678 2.09151L11.0117 2.0901ZM15.5098 6.63772C15.4953 6.33359 15.488 6.18153 15.3779 6.12081C15.2678 6.0601 15.1324 6.13681 14.8616 6.29022L11.6848 8.09025C10.7101 8.64255 9.88575 9 8.99985 9C8.11395 9 7.28959 8.64255 6.31489 8.09025L3.13834 6.29039C2.86757 6.13697 2.73219 6.06026 2.62206 6.12097C2.51193 6.18168 2.50468 6.33375 2.49017 6.63789C2.47062 7.04778 2.46002 7.52295 2.44802 8.08477C2.4325 8.8119 2.4325 9.1881 2.44804 9.91522C2.47302 11.0852 2.49196 11.8795 2.59824 12.4907C2.69832 13.0663 2.86528 13.4083 3.15091 13.6946C3.43357 13.978 3.7802 14.1478 4.37516 14.2513C5.0038 14.3607 5.82373 14.3832 7.02593 14.4133C8.46765 14.4495 9.53235 14.4495 10.9741 14.4133C12.1763 14.3832 12.9962 14.3607 13.6249 14.2513C14.2198 14.1478 14.5664 13.978 14.8491 13.6946C15.1347 13.4083 15.3017 13.0663 15.4018 12.4907C15.508 11.8795 15.527 11.0852 15.552 9.91522C15.5675 9.1881 15.5675 8.8119 15.552 8.08477C15.54 7.52287 15.5293 7.04765 15.5098 6.63772Z" fill="#A0A0AB"/>
</svg> },
  { label: 'Career Page', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1824 1.81514C12.1274 1.68749 10.7738 1.68749 9.03915 1.6875C7.3045 1.68749 5.87261 1.68749 4.81766 1.81514C3.74417 1.94504 2.89452 2.21519 2.22206 2.82041C1.54111 3.43327 1.22931 4.2206 1.08097 5.2136C0.937478 6.17416 0.937485 7.49567 0.9375 9.04688C0.937485 10.5981 0.937478 11.8259 1.08097 12.7864C1.22931 13.7794 1.54111 14.5667 2.22206 15.1796C2.89452 15.7848 3.74417 16.0549 4.81766 16.1848C5.87261 16.3125 7.30451 16.3125 9.03915 16.3125C10.7738 16.3125 12.1274 16.3125 13.1824 16.1848C14.2558 16.0549 15.1054 15.7848 15.778 15.1796C16.4589 14.5667 16.7707 13.7794 16.919 12.7864C17.0625 11.8259 17.0625 10.5981 17.0625 9.04688C17.0625 7.4957 17.0625 6.17416 16.919 5.2136C16.7707 4.2206 16.4589 3.43327 15.778 2.82041C15.1054 2.21519 14.2558 1.94504 13.1824 1.81514ZM7.03332 5.46449C6.83194 5.43742 6.58698 5.43746 6.33131 5.4375H5.6687C5.41304 5.43746 5.16807 5.43742 4.9667 5.46449C4.74093 5.49485 4.4878 5.5682 4.27799 5.77799C4.0682 5.9878 3.99485 6.24093 3.96449 6.46669C3.93742 6.66807 3.93746 6.91303 3.93751 7.16869V7.83127C3.93746 8.08687 3.93742 8.33197 3.96449 8.53335C3.99485 8.7591 4.0682 9.01222 4.27799 9.222C4.4878 9.43185 4.74093 9.5052 4.9667 9.5355C5.16807 9.56257 5.41304 9.56257 5.66871 9.5625H6.33131C6.58698 9.56257 6.83194 9.56257 7.03332 9.5355C7.25909 9.5052 7.51222 9.43185 7.722 9.222C7.93185 9.01222 8.0052 8.7591 8.0355 8.53335C8.06257 8.33197 8.06257 8.08695 8.0625 7.83127V7.16871C8.06257 6.91303 8.06257 6.66807 8.0355 6.46669C8.0052 6.24093 7.93185 5.9878 7.722 5.77799C7.51222 5.5682 7.25909 5.49485 7.03332 5.46449ZM3.9375 12C3.9375 11.6894 4.18934 11.4375 4.5 11.4375H7.5C7.81065 11.4375 8.0625 11.6894 8.0625 12C8.0625 12.3106 7.81065 12.5625 7.5 12.5625H4.5C4.18934 12.5625 3.9375 12.3106 3.9375 12ZM10.5 5.4375C10.1894 5.4375 9.9375 5.68934 9.9375 6C9.9375 6.31066 10.1894 6.5625 10.5 6.5625H13.5C13.8106 6.5625 14.0625 6.31066 14.0625 6C14.0625 5.68934 13.8106 5.4375 13.5 5.4375H10.5ZM9.9375 9C9.9375 8.68935 10.1894 8.4375 10.5 8.4375H13.5C13.8106 8.4375 14.0625 8.68935 14.0625 9C14.0625 9.31065 13.8106 9.5625 13.5 9.5625H10.5C10.1894 9.5625 9.9375 9.31065 9.9375 9ZM10.5 11.4375C10.1894 11.4375 9.9375 11.6894 9.9375 12C9.9375 12.3106 10.1894 12.5625 10.5 12.5625H13.5C13.8106 12.5625 14.0625 12.3106 14.0625 12C14.0625 11.6894 13.8106 11.4375 13.5 11.4375H10.5Z" fill="#A0A0AB"/>
</svg> },
  { label: 'Messaging', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.33474 1.36705C8.42767 1.29439 9.57007 1.29424 10.6653 1.36705C14.0902 1.59472 16.8077 4.35943 17.0312 7.8168C17.0729 8.4636 17.0729 9.1326 17.0312 9.7794C16.8077 13.2367 14.0902 16.0015 10.6653 16.2292C9.57007 16.3019 8.42767 16.3018 7.33474 16.2292C6.91104 16.201 6.44983 16.1008 6.04379 15.9336C5.86522 15.86 5.74401 15.8103 5.65531 15.7777C5.59432 15.8197 5.51331 15.8792 5.39535 15.9662C4.80102 16.4044 4.05069 16.7119 2.98588 16.686L2.95158 16.6852C2.74616 16.6802 2.52721 16.675 2.34864 16.6405C2.13356 16.5988 1.86747 16.4948 1.70093 16.2109C1.51967 15.9019 1.59235 15.5893 1.66266 15.3925C1.72902 15.2068 1.84405 14.9889 1.96156 14.7664L1.97767 14.7358C2.32742 14.0731 2.42485 13.5314 2.23786 13.1703C1.61361 12.228 1.05204 11.0667 0.968848 9.7794C0.927051 9.1326 0.927051 8.4636 0.968848 7.8168C1.19229 4.35943 3.90975 1.59472 7.33474 1.36705ZM5.8125 7.125C5.8125 7.43566 6.06434 7.6875 6.375 7.6875H9C9.31065 7.6875 9.5625 7.43566 9.5625 7.125C9.5625 6.81434 9.31065 6.5625 9 6.5625H6.375C6.06434 6.5625 5.8125 6.81434 5.8125 7.125ZM5.8125 10.875C5.8125 11.1856 6.06434 11.4375 6.375 11.4375H11.625C11.9356 11.4375 12.1875 11.1856 12.1875 10.875C12.1875 10.5643 11.9356 10.3125 11.625 10.3125H6.375C6.06434 10.3125 5.8125 10.5643 5.8125 10.875Z" fill="#A0A0AB"/>
</svg>, badge: '10' }
]

const supportLinks = [
  { label: 'Support', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.00015 3C6.56164 3 4.73617 4.57114 4.52137 6.39047C4.61297 6.42977 4.70126 6.47013 4.78126 6.50675C5.04837 6.62609 5.55204 6.85111 5.74388 7.41893C5.81364 7.6254 5.81309 7.8462 5.81258 8.05163V11.4484C5.81309 11.6538 5.81364 11.8745 5.74388 12.0811C5.55204 12.6489 5.04837 12.8739 4.78126 12.9932C4.50907 13.1178 4.141 13.2858 3.87271 13.3076C3.57469 13.3316 3.27297 13.268 3.01118 13.121C2.77343 12.9876 2.59494 12.7699 2.41415 12.5492C2.34878 12.4699 2.22503 12.3239 2.13812 12.2231C1.97922 12.039 1.79879 11.83 1.65004 11.6353C1.4043 11.3137 1.15805 10.9283 1.03573 10.4806C0.904755 10.0011 0.904755 9.4989 1.03573 9.01942C1.12449 8.69452 1.28509 8.4078 1.49708 8.10682C1.70238 7.81538 2.05203 7.38823 2.39404 6.97283C2.44918 6.9029 2.52499 6.80677 2.58104 6.74257C2.68255 6.62629 2.82301 6.48456 3.01118 6.37895L3.0147 6.37697C3.23514 3.56214 5.93306 1.5 9.00015 1.5C12.0673 1.5 14.7652 3.56214 14.9857 6.37698L14.9891 6.37895C15.1773 6.48456 15.3178 6.62629 15.4193 6.74257C15.4753 6.80677 15.5512 6.90289 15.6063 6.97283C15.9483 7.38823 16.2979 7.81538 16.5033 8.10682C16.7153 8.4078 16.8758 8.69452 16.9646 9.01942C17.0956 9.4989 17.0956 10.0011 16.9646 10.4806C16.8423 10.9283 16.5961 11.3137 16.3503 11.6353C16.2016 11.83 16.0212 12.039 15.8623 12.2231C15.7754 12.3239 15.6516 12.4699 15.5862 12.5492C15.4082 12.7663 15.2324 12.9809 15.0002 13.1148V13.35C15.0002 15.2372 13.1564 16.5 11.2502 16.5H9.75015C9.33593 16.5 9.00015 16.1642 9.00015 15.75C9.00015 15.3358 9.33593 15 9.75015 15H11.2502C12.6576 15 13.5002 14.1137 13.5002 13.35V13.1185C13.401 13.0765 13.3052 13.0327 13.2191 12.9932C12.952 12.8739 12.4483 12.6489 12.2565 12.0811C12.1867 11.8745 12.1873 11.6538 12.1877 11.4484V8.05163C12.1873 7.8462 12.1867 7.6254 12.2565 7.41893C12.4483 6.85111 12.952 6.62609 13.2191 6.50675C13.2991 6.47013 13.3874 6.42977 13.479 6.39047C13.2642 4.57114 11.4387 3 9.00015 3Z" fill="#A0A0AB"/>
</svg> },
  { label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clip-path="url(#clip0_3193_10049)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.1317 0.942427C9.04403 0.935858 8.95597 0.935858 8.8683 0.942427C8.4906 0.970732 8.18452 1.14116 7.90485 1.35997C7.64182 1.56578 7.35081 1.8568 7.01047 2.19717L6.43993 2.68567C6.43993 2.68567 6.13398 2.72546 5.64951 2.72546C5.1161 2.72543 4.66018 2.7254 4.29585 2.77439C3.90683 2.82669 3.53914 2.94395 3.24155 3.24155C2.94395 3.53914 2.82669 3.90683 2.77439 4.29585C2.7254 4.66018 2.72543 5.1161 2.72546 5.64951L2.68567 6.43993L2.19717 7.01047C1.85682 7.35079 1.56577 7.64182 1.35997 7.90485C1.14116 8.18452 0.970732 8.4906 0.942427 8.8683C0.935858 8.95597 0.935858 9.04403 0.942427 9.1317C0.970732 9.5094 1.14116 9.81548 1.35997 10.0951C1.56578 10.3582 1.8568 10.6492 2.19717 10.9895L2.68567 11.5601L2.72546 12.3505C2.72543 12.8839 2.7254 13.3398 2.77439 13.7041C2.82669 14.0932 2.94395 14.4608 3.24155 14.7584C3.53914 15.056 3.90683 15.1733 4.29585 15.2256C4.66018 15.2746 5.11611 15.2746 5.64952 15.2746L6.43993 15.3143L7.01047 15.8028C7.35078 16.1432 7.64182 16.4342 7.90485 16.64C8.18452 16.8589 8.4906 17.0293 8.8683 17.0576C8.95597 17.0641 9.04403 17.0641 9.1317 17.0576C9.5094 17.0293 9.81548 16.8589 10.0951 16.64C10.3582 16.4342 10.6492 16.1432 10.9895 15.8028L11.5601 15.3143L12.3505 15.2746C12.8839 15.2746 13.3398 15.2746 13.7041 15.2256C14.0932 15.1733 14.4608 15.056 14.7584 14.7584C15.056 14.4608 15.1733 14.0932 15.2256 13.7041C15.2746 13.3398 15.2746 12.8839 15.2746 12.3505L15.3143 11.5601L15.8029 10.9895C16.1432 10.6492 16.4342 10.3582 16.64 10.0951C16.8589 9.81548 17.0293 9.5094 17.0576 9.1317C17.0641 9.04403 17.0641 8.95597 17.0576 8.8683C17.0293 8.4906 16.8589 8.18452 16.64 7.90485C16.4342 7.64182 16.1432 7.3508 15.8028 7.01045L15.3143 6.43993L15.2746 5.64952C15.2746 5.11611 15.2746 4.66018 15.2256 4.29585C15.1733 3.90683 15.056 3.53914 14.7584 3.24155C14.4608 2.94395 14.0932 2.82669 13.7041 2.77439C13.3398 2.7254 12.8839 2.72543 12.3505 2.72546C11.8661 2.72546 11.516 2.66744 11.516 2.66744L10.9895 2.19717C10.6492 1.8568 10.3582 1.56578 10.0951 1.35997C9.81548 1.14116 9.5094 0.970732 9.1317 0.942427ZM9 5.8125C7.23959 5.8125 5.8125 7.23959 5.8125 9C5.8125 10.7604 7.23959 12.1875 9 12.1875C10.7604 12.1875 12.1875 10.7604 12.1875 9C12.1875 7.23959 10.7604 5.8125 9 5.8125Z" fill="#A0A0AB"/>
  </g>
  <defs>
    <clipPath id="clip0_3193_10049">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg> }
]

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [userProjects, setUserProjects] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showUploadJDModal, setShowUploadJDModal] = useState(false)
  const [activeFilterCategory, setActiveFilterCategory] = useState('location')
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false)
  const [projectSearchInput, setProjectSearchInput] = useState('')
  
  // Filter states
  const [preferredLocation, setPreferredLocation] = useState('')
  const [preferredLocationTags, setPreferredLocationTags] = useState<string[]>(['Chennai, Tami...', 'Bangalore, Ka...', 'Mumbai'])
  const [postLocation, setPostLocation] = useState('')
  const [postLocationTags, setPostLocationTags] = useState<string[]>([])
  const [availability, setAvailability] = useState('')
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false)
  const [industry, setIndustry] = useState('')
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [minExperience, setMinExperience] = useState('')
  const [maxExperience, setMaxExperience] = useState('')
  const [skills, setSkills] = useState('')

  // Refs for scroll detection
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const salaryRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const skillRef = useRef<HTMLDivElement>(null)
  const industryRef = useRef<HTMLDivElement>(null)

  // Handle scroll to update active section
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const scrollContainer = scrollContainerRef.current
    const scrollTop = scrollContainer.scrollTop
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
    const scrollPercentage = (scrollTop / scrollHeight) * 100

    // Divide scroll into 5 equal parts (20% each)
    if (scrollPercentage < 20) {
      setActiveFilterCategory('location')
    } else if (scrollPercentage < 40) {
      setActiveFilterCategory('salary')
    } else if (scrollPercentage < 60) {
      setActiveFilterCategory('experience')
    } else if (scrollPercentage < 80) {
      setActiveFilterCategory('skill')
    } else {
      setActiveFilterCategory('industry')
    }
  }

  // Scroll to section when clicking sidebar
  const scrollToSection = (key: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      location: locationRef,
      salary: salaryRef,
      experience: experienceRef,
      skill: skillRef,
      industry: industryRef
    }
    
    const ref = refs[key]
    if (ref.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: ref.current.offsetTop - 20,
        behavior: 'smooth'
      })
    }
  }

  // Show modal if no projects exist and fetch projects on mount
  useEffect(() => {
    fetchUserProjects()
  }, [])

  useEffect(() => {
    if (userProjects.length === 0) {
      setShowModal(true)
    }
  }, [userProjects.length])

  const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found')
        return
      }

      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setUserProjects(data.projects.map((p: any) => p.name))
        if (data.projects.length > 0 && !selectedProject) {
          setSelectedProject(data.projects[0].name)
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          console.error('No auth token found')
          return
        }

        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: projectName.trim() })
        })

        const data = await response.json()

        if (data.success) {
          const newProject = projectName.trim()
          setUserProjects([...userProjects, newProject])
          setSelectedProject(newProject)
          setProjectName('')
          setShowModal(false)
        } else {
          alert(data.message || 'Failed to create project')
        }
      } catch (error) {
        console.error('Error creating project:', error)
        alert('Failed to create project. Please try again.')
      }
    }
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  // Detect categories from search input
  const detectedCategories = useMemo(() => detectCategories(searchInput), [searchInput])
  const borderColor = useMemo(() => getBorderColor(searchInput), [searchInput])

  return (
    <div className="min-h-screen flex px-[16px] py-[12px]" style={{ backgroundColor: '#1a1a1e' }}>
      {/* Sidebar */}
      <aside className={`w-[220px] mr-[16px] flex flex-col justify-between border-white/5 transition-all duration-300 ${showModal || showFilterModal ? 'blur-[2px]' : ''}`}>
        <div>
          <div className="text-white text-2xl mb-[20px]" style={{ fontFamily: 'var(--font-heading)' }}>
            Loopx
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] h-[24px] font-body text-[14px]  px-[12px]  pb-[4px]" style={{ color: '#70707B' }}>Projects</p>
              <div className="space-y-1">
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-left px-4 py-2 flex items-center gap-3 text-[14px] transition text-[#A1A1AA] hover:text-white"
                >
                  <span>{newProjectIcon}</span>
                  <span>New Project</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 flex items-center gap-3 text-[14px] transition text-[#A1A1AA] hover:text-white"
                >
                  <span>{allProjectsIcon}</span>
                  <span>All Projects</span>
                </button>
                {selectedProject && (
                  <div className="relative">
                    <button
                      onClick={() => setShowProjectsDropdown(!showProjectsDropdown)}
                      className="w-full text-left px-4 py-2 flex items-center gap-3 text-[14px] transition text-[#a48afb] border rounded-lg border-[#26272b]"
                    >
                      <span style={{ color: '#A48AFB' }}>{projectIcon}</span>
                      <span className="flex-1">{selectedProject}</span>
                      <ChevronDown 
                        className="w-4 h-4 transition-transform duration-200" 
                        style={{ 
                          color: '#A48AFB',
                          transform: showProjectsDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </button>

                    {showProjectsDropdown && (
                      <div 
                        className="absolute left-0 mt-2 border z-50"
                        style={{
                          backgroundColor: '#131316',
                          borderColor: '#26272B',
                          borderRadius: '24px',
                          borderWidth: '1px',
                          width: '300px',
                          padding: '16px'
                        }}
                      >
                        {/* Search Input */}
                        <div className="mb-1">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Find projects"
                              value={projectSearchInput}
                              onChange={(e) => setProjectSearchInput(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
                              style={{
                                backgroundColor: '#131316',
                                border: '1px solid #26272B',
                                color: '#70707B',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '20px'
                              }}
                            />
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" 
                              height="20" 
                              viewBox="0 0 20 20" 
                              fill="none"
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            >
                              <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#70707B" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                      <div className='bg-[#1A1A1E] p-2 rounded-lg'>
                        {/* Projects List */}
                        <div 
                          className="mb-3 max-h-[200px] overflow-y-auto"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                          }}
                        >
                          {userProjects
                            .filter(project => 
                              project.toLowerCase().includes(projectSearchInput.toLowerCase())
                            )
                            .map((project, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSelectedProject(project)
                                  setShowProjectsDropdown(false)
                                  setProjectSearchInput('')
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 mb-1"
                                style={{
                                  backgroundColor: selectedProject === project ? '#26272B' : 'transparent',
                                  color: '#FFFFFF',
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  lineHeight: '20px'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedProject !== project) {
                                    e.currentTarget.style.backgroundColor = '#26272B'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedProject !== project) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                  }
                                }}
                              >
                                {project}
                              </button>
                            ))}
                        </div>

                        {/* New Project Button */}
                        <div className="pt-2 border-t" style={{ borderColor: '#26272B' }}>
                          <button
                            onClick={() => {
                              setShowProjectsDropdown(false)
                              setShowModal(true)
                              setProjectSearchInput('')
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-[#3F3F46] flex items-center justify-center gap-2 transition-all duration-200"
                            style={{
                              backgroundColor: '#26272B',
                              color: '#FFFFFF',
                              fontFamily: 'var(--font-body)',
                              fontSize: '14px',
                              fontWeight: 500,
                              lineHeight: '20px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2F2F35'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#26272B'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>New Project</span>
                          </button>
                        </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="mt-3 w-full rounded-lg py-2 text-[14px] font-medium text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#875BF7' }}>
                 New search
              </button>
              <div className="flex justify-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '196px', 
                  height: '1px', 
                  background: 'linear-gradient(90deg, var(--Border-Primary, #1A1A1E) 0%, var(--Border-Secondary, #26272B) 50%, var(--Border-Primary, #1A1A1E) 100%)' 
                }} />
              </div>
            </div>

            <div>
              <p 
                className="flex items-center font-body" 
                style={{ 
                  height: '24px',
                  padding: '0 12px 4px 12px',
                  alignSelf: 'stretch',
                  color: '#70707B',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}
              >
                General
              </p>
              <div className="space-y-1">
                {generalLinks.map((link) => (
                  <button 
                    key={link.label} 
                    className="flex font-body items-center justify-between transition" 
                    style={{ 
                      display: 'flex',
                      width: '220px',
                      height: '40px',
                      padding: '2px 0',
                      alignItems: 'center'
                    }}
                  >
                    <span 
                      className="flex items-center"
                      style={{ 
                        display: 'flex',
                        padding: '8px 12px',
                        alignItems: 'center',
                        gap: '12px',
                        flex: '1 0 0'
                      }}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span 
                        className="font-body"
                        style={{ 
                          overflow: 'hidden',
                          color: '#A0A0AB',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          textOverflow: 'ellipsis',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px'
                        }}
                      >
                        {link.label}
                      </span>
                    </span>
                    {link.badge && (
                      <span className="text-[11px] px-2 py-0.5 rounded-sm border border-[#315f45]" style={{ backgroundColor: '#172820', color: '#caf7da' }}>{link.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-1">
            {supportLinks.map((link) => (
              <button 
                key={link.label} 
                className="flex items-center transition" 
                style={{ 
                  display: 'flex',
                  width: '220px',
                  height: '40px',
                  padding: '2px 0',
                  alignItems: 'center'
                }}
              >
                <span 
                  className="flex items-center"
                  style={{ 
                    display: 'flex',
                    padding: '8px 12px',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1 0 0'
                  }}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span 
                    className="font-body"
                    style={{ 
                      overflow: 'hidden',
                      color: '#A0A0AB',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      textOverflow: 'ellipsis',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px'
                    }}
                  >
                    {link.label}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 relative overflow-hidden bg-[#131316] rounded-2xl transition-all duration-300 ${showModal || showFilterModal ? 'blur-[2px]' : ''}`}>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h1 
              className="mb-3" 
              style={{ 
                color: '#FFF',
                fontFamily: '"Denton Test"',
                fontSize: '30px',
                fontStyle: 'normal',
                fontWeight: 540,
                lineHeight: '38px'
              }}
            >
              Good Morning, Tejash!
            </h1>
            <p 
              className="mb-8 font-body" 
              style={{ 
                color: '#70707B',
                textAlign: 'center',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '20px'
              }}
            >
              Find the perfect match in seconds
            </p>

            <div 
              className="mx-auto w-full max-w-3xl rounded-3xl bg-[#161619] border-x-1 border-b-1 transition-all duration-300"
              style={{
                boxShadow: searchInput.trim() ? '0 0 47px 0 rgba(135, 91, 247, 0.10)' : 'none'
              }}
            >
              <div 
                className="max-w-[640px] mx-auto p-4 bg-[#1A1A1E] rounded-2xl  border-2 transition-colors duration-300"
                
              >
                <div className="mb-4">
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border-none bg-transparent font-body text-[14px] text-white"
                    placeholder="Ask loopx for UX Designer in Mumbai with 2+ years experience at top consulting firms"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center justify-center gap-1.5 font-body"
                    style={{
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: '0.5px solid #3F3F46',
                      background: '#26272B',
                      color: '#FFFFFF',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: '18px',
                    }}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33301 4.66667C1.33301 4.29848 1.63149 4 1.99967 4H3.99967C4.36786 4 4.66634 4.29848 4.66634 4.66667C4.66634 5.03485 4.36786 5.33333 3.99967 5.33333H1.99967C1.63149 5.33333 1.33301 5.03485 1.33301 4.66667Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33301 11.3333C1.33301 10.9651 1.63149 10.6667 1.99967 10.6667H5.99967C6.36786 10.6667 6.66634 10.9651 6.66634 11.3333C6.66634 11.7015 6.36786 12 5.99967 12H1.99967C1.63149 12 1.33301 11.7015 1.33301 11.3333Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.333 11.3333C11.333 10.9651 11.6315 10.6667 11.9997 10.6667H13.9997C14.3679 10.6667 14.6663 10.9651 14.6663 11.3333C14.6663 11.7015 14.3679 12 13.9997 12H11.9997C11.6315 12 11.333 11.7015 11.333 11.3333Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33301 4.66667C9.33301 4.29848 9.63147 4 9.99967 4H13.9997C14.3679 4 14.6663 4.29848 14.6663 4.66667C14.6663 5.03486 14.3679 5.33333 13.9997 5.33333H9.99967C9.63147 5.33333 9.33301 5.03485 9.33301 4.66667Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.98317 2.16666H6.01683C6.31314 2.16665 6.5605 2.16665 6.7636 2.1805C6.975 2.19493 7.17467 2.22602 7.36827 2.30621C7.81747 2.49228 8.1744 2.84918 8.36047 3.2984C8.44067 3.492 8.47173 3.69168 8.48613 3.90308C8.5 4.10616 8.5 4.35351 8.5 4.64982V4.6835C8.5 4.9798 8.5 5.22716 8.48613 5.43024C8.47173 5.64164 8.44067 5.84132 8.36047 6.03491C8.1744 6.48413 7.81747 6.84106 7.36827 7.02712C7.17467 7.10732 6.975 7.13839 6.7636 7.15279C6.5605 7.16666 6.31315 7.16666 6.01684 7.16666H5.98316C5.68685 7.16666 5.4395 7.16666 5.23643 7.15279C5.02503 7.13839 4.82534 7.10732 4.63175 7.02712C4.18253 6.84106 3.82563 6.48413 3.63955 6.03491C3.55937 5.84132 3.52827 5.64164 3.51385 5.43024C3.49999 5.22716 3.49999 4.9798 3.5 4.68349V4.64982C3.49999 4.35352 3.49999 4.10616 3.51385 3.90308C3.52827 3.69168 3.55937 3.492 3.63955 3.2984C3.82563 2.84918 4.18253 2.49228 4.63175 2.30621C4.82534 2.22602 5.02503 2.19493 5.23643 2.1805C5.4395 2.16665 5.68686 2.16665 5.98317 2.16666Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.98313 8.83334H10.0169C10.3131 8.83334 10.5605 8.83334 10.7636 8.84721C10.975 8.86161 11.1747 8.89268 11.3683 8.97288C11.8175 9.15894 12.1744 9.51588 12.3605 9.96508C12.4407 10.1587 12.4717 10.3583 12.4861 10.5697C12.5 10.7728 12.5 11.0202 12.5 11.3165V11.3502C12.5 11.6465 12.5 11.8939 12.4861 12.0969C12.4717 12.3083 12.4407 12.508 12.3605 12.7016C12.1744 13.1508 11.8175 13.5077 11.3683 13.6938C11.1747 13.774 10.975 13.8051 10.7636 13.8195C10.5605 13.8333 10.3131 13.8333 10.0169 13.8333H9.98313C9.68687 13.8333 9.43947 13.8333 9.2364 13.8195C9.025 13.8051 8.82533 13.774 8.63173 13.6938C8.18253 13.5077 7.8256 13.1508 7.63953 12.7016C7.55933 12.508 7.52827 12.3083 7.51387 12.0969C7.5 11.8939 7.5 11.6465 7.5 11.3502V11.3165C7.5 11.0202 7.5 10.7728 7.51387 10.5697C7.52827 10.3583 7.55933 10.1587 7.63953 9.96508C7.8256 9.51588 8.18253 9.15894 8.63173 8.97288C8.82533 8.89268 9.025 8.86161 9.2364 8.84721C9.43947 8.83334 9.68687 8.83334 9.98313 8.83334Z" fill="white"/>
</svg>
                    Filters
                  </button>

                  <div className="flex items-center gap-[12px]">
                    <button
                      onClick={() => setShowUploadJDModal(true)}
                      className="flex items-center justify-center gap-1.5 font-body"
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: '0.5px solid #3F3F46',
                        background: '#26272B',
                        color: '#FFFFFF',
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                      }}
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.38235 2.79999C4.95291 2.79999 3.79412 3.96405 3.79412 5.39999V8.975C3.79412 11.3084 5.67715 13.2 8 13.2C10.3229 13.2 12.2059 11.3084 12.2059 8.975V8C12.2059 7.64107 12.4956 7.35 12.8529 7.35C13.2103 7.35 13.5 7.64107 13.5 8V8.975C13.5 12.0264 11.0375 14.5 8 14.5C4.96243 14.5 2.5 12.0264 2.5 8.975V5.39999C2.5 3.24609 4.23819 1.5 6.38235 1.5C8.52653 1.5 10.2647 3.24609 10.2647 5.39999V8.975C10.2647 10.2314 9.25073 11.25 8 11.25C6.74927 11.25 5.73529 10.2314 5.73529 8.975V6.37499C5.73529 6.016 6.02499 5.72499 6.38235 5.72499C6.73973 5.72499 7.0294 6.016 7.0294 6.37499V8.975C7.0294 9.51347 7.46393 9.95 8 9.95C8.53607 9.95 8.9706 9.51347 8.9706 8.975V5.39999C8.9706 3.96405 7.8118 2.79999 6.38235 2.79999Z" fill="white"/>
</svg>
                      Job description
                    </button>

                    <button
                      className="flex items-center justify-center font-body"
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: '0.5px solid #3F3F46',
                        background: '#26272B',
                      }}
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M3.75 8.25023C3.33578 8.25023 3 8.586 3 9.00023C3.00005 9.41438 3.33582 9.75023 3.75 9.75023H12.9455C12.5597 10.1804 12.0434 10.6643 11.5085 11.1287C10.9592 11.6056 10.4073 12.048 9.99172 12.3723C9.78442 12.5341 9.36645 12.8542 9.24608 12.9451C8.96438 13.2002 8.9157 13.6322 9.14572 13.9448C9.39135 14.2782 9.86107 14.3498 10.1946 14.1045C10.3203 14.0096 10.7001 13.7225 10.9145 13.5552C11.3427 13.2211 11.9158 12.7607 12.4915 12.261C13.0633 11.7645 13.6545 11.2141 14.1086 10.7002C14.3349 10.4441 14.5434 10.1797 14.6989 9.9216C14.8422 9.68408 15 9.3573 15 9.00023L14.9927 8.8677C14.9605 8.56298 14.8242 8.28735 14.6989 8.0796C14.5434 7.82145 14.3349 7.5564 14.1086 7.30028C13.6546 6.78636 13.0633 6.23597 12.4915 5.7395C11.9158 5.23976 11.3427 4.77943 10.9145 4.4453C10.7001 4.27796 10.3203 3.99095 10.1946 3.89599C9.86107 3.65063 9.39202 3.72227 9.14647 4.05566C8.91622 4.36836 8.9643 4.80023 9.24608 5.05541C9.24608 5.05541 9.43132 5.19822 9.49148 5.24364C9.61177 5.33455 9.78442 5.4664 9.99172 5.62817C10.4073 5.95249 10.9592 6.39487 11.5085 6.87182C12.0434 7.33623 12.5597 7.8201 12.9455 8.25023H3.75Z" fill="white"/>
</svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-[16px] justify-center">
                {[
                  { label: 'Location', key: 'location' },
                  { label: 'Job title', key: 'jobTitle' },
                  { label: 'Years of experience', key: 'experience' },
                  { label: 'Expected salary', key: 'salary' },
                  { label: 'Skills', key: 'skills' },
                  { label: 'Industry', key: 'industry' }
                ].map(({ label, key }) => {
                  const isHighlighted = detectedCategories[key as keyof typeof detectedCategories];
                  return (
                  <button
                    key={label}
                    className="flex items-center font-body transition-all duration-300"
                    style={{
                      padding: '2px 8px 2px 6px',
                      alignItems: 'center',
                      gap: '2px',
                      borderRadius: '6px',
                      border: `1px solid ${isHighlighted ? '#315f45' : '#26272B'}`,
                      background: isHighlighted ? '#172820' : '#131316',
                      color: isHighlighted ? '#caf7da' : '#A0A0AB',
                      textAlign: 'center',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '18px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <g clipPath="url(#clip0_3193_6463)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 11.375C3.03147 11.375 0.625 8.96855 0.625 6C0.625 3.03147 3.03147 0.625 6 0.625C8.96855 0.625 11.375 3.03147 11.375 6C11.375 8.96855 8.96855 11.375 6 11.375ZM8.24 4.68878C8.48225 4.55628 8.57125 4.25247 8.43875 4.01019C8.30625 3.76791 8.00245 3.67891 7.7602 3.81141C6.84585 4.31143 6.0898 5.27645 5.58145 6.0548C5.3936 6.3425 5.2331 6.61485 5.1047 6.84555C4.98492 6.72935 4.86629 6.6285 4.76019 6.5446C4.62135 6.43485 4.49641 6.34825 4.40531 6.2886L4.2478 6.19075C4.00793 6.05395 3.70256 6.1375 3.56576 6.3774C3.42898 6.6172 3.51247 6.92245 3.75221 7.05935L3.85736 7.1251C3.92876 7.17185 4.02882 7.24115 4.13999 7.32905C4.36877 7.5099 4.61563 7.747 4.77099 8.00675C4.86633 8.16615 5.0422 8.25955 5.22765 8.24935C5.41305 8.2391 5.57755 8.1268 5.6548 7.95795L5.70395 7.85525C5.7378 7.78605 5.7885 7.68485 5.8545 7.5602C5.98675 7.31035 6.17905 6.9686 6.4187 6.6016C6.9104 5.84875 7.5543 5.06375 8.24 4.68878Z"
                          fill={isHighlighted ? '#caf7da' : '#70707B'}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3193_6463">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{label}</span>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed w- inset-0 flex items-center justify-center bg-black/50 z-50">
          <div 
            className="text-left relative "
            style={{
              display: 'flex',
              width: '400px',
              maxWidth: '400px',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-3xl, 24px)',
              flexShrink: 0,
              borderRadius: 'var(--radius-2xl, 16px)',
              background: 'var(--Surface-Primary, #131316)',
              padding: '32px'
            }}
          >
            <div className="flex  justify-between items-start w-full">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" >
                <img src="/foldericon.svg" alt="" className="w-full h-full" />
              </div>
             <div onClick={() => setShowModal(false)} className='absolute right-[10px] top-[10px] p-[6px] px-[12px]  bg-[#1a1a1e] border rounded-lg border-[#26272B] '>
               <button  className="text-[#70707B] hover:text-white text-[18px] leading-none">
             <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
  <path d="M9.75 0.75L0.750608 9.7494M9.7494 9.75L0.75 0.750638" stroke="#A48AFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
              </button>
             </div>
            </div>
            <div className="w-full">
              <h2 className="text-[16px] font-normal text-white leading-tight" style={{ fontFamily: 'var(--font-body)' }}>Create new project</h2>
              <p className="text-[14px]  leading-relaxed " style={{ color: '#65656f' }}>Please enter a name for this project.</p>
            </div>
            <Input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className='w-full rounded-2xl px-4 py-3.5 text-[16px] focus:outline-none placeholder:text-[#70707B]'
              style={{
                backgroundColor: '#1A1A1E',
                color: '#d1d1d6',
                border: '2px solid #875BF7'
              }}
            />
            <Button
              disabled={!projectName.trim()}
              onClick={handleCreateProject}
              className="w-full rounded-2xl py-3.5 text-[16px] font-normal flex items-center justify-center gap-2 text-white transition hover:opacity-90 disabled:opacity-100"
              style={{ backgroundColor: projectName.trim() ? '#875BF7' : '#51525c' }}
            >
              Create Project <ArrowRight  width={"20px"}/>
            </Button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div 
            className="relative flex flex-col"
            style={{
              width: '900px',
              height: '600px',
              borderRadius: '16px',
              background: '#1a1a1e',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-[68px] py-[16px] px-[20px] border-b-[0.5px] border-[#26272b]">
              <h2 className="text-[20px] font-medium text-white" style={{ fontFamily: 'var(--font-body)' }}>
                Add your search filters
              </h2>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowFilterModal(false)}
                  className="rounded-xl px-6 py-2.5 text-[14px] font-medium text-white transition"
                  style={{ backgroundColor: '#875BF7' }}
                >
                  Show results
                </Button>
               
              </div>
            </div>

            {/* Content Area - Horizontal Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar - Filter Categories */}
              <div 
                className="flex flex-col px-[16px] pb-[16px] pt-[6px] w-[220px] h-[732px]"
                style={{
                
                  background: '#1a1a1e',
                  borderRight: '0.5px solid #26272b'
                }}
              >
                {[
                  { 
                    key: 'location', 
                    label: 'Location',
                    icon: (color: string) => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M5.98169 13.1477C6.07265 13.5518 5.8188 13.9532 5.4147 14.0441C4.76411 14.1905 4.28262 14.3659 3.98305 14.5373C3.92309 14.5716 3.87677 14.6018 3.84119 14.6274C3.85469 14.6372 3.86968 14.6475 3.88633 14.6586C4.09787 14.799 4.45346 14.9546 4.96011 15.0969C5.963 15.3785 7.39158 15.5624 9 15.5624C10.6084 15.5624 12.037 15.3785 13.0399 15.0969C13.5466 14.9546 13.9021 14.799 14.1136 14.6586C14.1303 14.6476 14.1453 14.6372 14.1588 14.6274C14.1233 14.6018 14.0769 14.5716 14.017 14.5373C13.7174 14.3659 13.2359 14.1905 12.5853 14.0441C12.1812 13.9532 11.9273 13.5518 12.0183 13.1477C12.1093 12.7436 12.5106 12.4898 12.9147 12.5807C13.6358 12.743 14.2793 12.9593 14.7618 13.2353C15.1906 13.4807 15.75 13.9252 15.75 14.6276C15.75 15.2471 15.3102 15.6647 14.9433 15.9083C14.5476 16.171 14.0246 16.3784 13.4454 16.541C12.2767 16.8692 10.7053 17.0624 9 17.0624C7.29472 17.0624 5.72329 16.8692 4.55461 16.541C3.97547 16.3784 3.45238 16.171 3.05669 15.9083C2.68983 15.6647 2.25 15.2471 2.25 14.6276C2.25 13.9252 2.80934 13.4807 3.23819 13.2353C3.72069 12.9593 4.3642 12.743 5.0853 12.5807C5.48941 12.4898 5.89073 12.7436 5.98169 13.1477Z" fill="#A48AFB"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.00037 0.9375C6.71224 0.9375 4.53906 2.3287 3.63118 4.5118C2.78598 6.54422 3.24547 8.27625 4.19455 9.75173C4.96915 10.9559 6.09934 12.0308 7.10766 12.9898C7.29928 13.1721 7.48649 13.3501 7.66605 13.5241L7.66725 13.5254C8.02522 13.8701 8.50327 14.0625 9.00037 14.0625C9.49747 14.0625 9.9756 13.8701 10.3336 13.5253C10.5031 13.3619 10.6794 13.1949 10.8596 13.0241L10.8604 13.0234C11.8795 12.0577 13.0252 10.9719 13.8079 9.7524C14.7559 8.2755 15.2137 6.54171 14.3696 4.5118C13.4617 2.3287 11.2885 0.9375 9.00037 0.9375ZM9 4.5C7.75732 4.5 6.75 5.50736 6.75 6.75C6.75 7.99268 7.75732 9 9 9C10.2427 9 11.25 7.99268 11.25 6.75C11.25 5.50736 10.2427 4.5 9 4.5Z" fill="#A48AFB"/>
</svg>
                    )
                  },
                  { 
                    key: 'salary', 
                    label: 'Salary',
                    icon: (color: string) => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7682 1.42892C11.8097 1.31249 10.592 1.31249 9.03848 1.3125H8.96152C7.40798 1.31249 6.19032 1.31249 5.23184 1.42892C4.25236 1.5479 3.46842 1.79558 2.82425 2.34575C2.65247 2.49248 2.49248 2.65247 2.34575 2.82425C1.79558 3.46842 1.5479 4.25236 1.42892 5.23184C1.31249 6.19032 1.31249 7.40798 1.3125 8.96152V9.03848C1.31249 10.592 1.31249 11.8097 1.42892 12.7682C1.5479 13.7477 1.79558 14.5316 2.34575 15.1757C2.49248 15.3476 2.65247 15.5075 2.82425 15.6542C3.46842 16.2044 4.25236 16.4521 5.23184 16.5711C6.19032 16.6875 7.40798 16.6875 8.96152 16.6875H9.03848C10.592 16.6875 11.8097 16.6875 12.7682 16.5711C13.7477 16.4521 14.5316 16.2044 15.1757 15.6542C15.3476 15.5075 15.5075 15.3476 15.6542 15.1757C16.2044 14.5316 16.4521 13.7477 16.5711 12.7682C16.6875 11.8097 16.6875 10.592 16.6875 9.03848V8.96152C16.6875 7.40798 16.6875 6.19032 16.5711 5.23184C16.4521 4.25236 16.2044 3.46842 15.6542 2.82425C15.5075 2.65247 15.3476 2.49248 15.1757 2.34575C14.5316 1.79558 13.7477 1.5479 12.7682 1.42892ZM9.5625 5.25C9.5625 4.93934 9.31065 4.6875 9 4.6875C8.68935 4.6875 8.4375 4.93934 8.4375 5.25V5.56812C7.97603 5.64665 7.55258 5.8209 7.20897 6.07283C6.72989 6.42412 6.375 6.95595 6.375 7.59585C6.375 8.15873 6.57702 8.679 7.09333 9.0246C7.56143 9.33802 8.21415 9.45465 9 9.45465C9.71865 9.45465 10.1459 9.56258 10.3816 9.71528C10.566 9.83483 10.6875 10.0155 10.6875 10.4044C10.6875 10.7313 10.5533 10.9331 10.3027 11.0828C10.0179 11.2528 9.5706 11.3543 9 11.3543C8.47515 11.3543 8.0253 11.2103 7.72283 11.007C7.4168 10.8013 7.3125 10.5777 7.3125 10.4044C7.3125 10.0938 7.06066 9.84195 6.75 9.84195C6.43934 9.84195 6.1875 10.0938 6.1875 10.4044C6.1875 11.0665 6.58688 11.599 7.09522 11.9407C7.47067 12.193 7.93395 12.365 8.4375 12.4387V12.75C8.4375 13.0607 8.68935 13.3125 9 13.3125C9.31065 13.3125 9.5625 13.0607 9.5625 12.75V12.4504C10.04 12.3994 10.4981 12.2763 10.8793 12.0488C11.443 11.7122 11.8125 11.1579 11.8125 10.4044C11.8125 9.71325 11.559 9.13777 10.9934 8.77117C10.4791 8.4378 9.78135 8.32965 9 8.32965C8.28585 8.32965 7.90733 8.21572 7.71915 8.0898C7.5792 7.99612 7.5 7.86817 7.5 7.59585C7.5 7.40049 7.6068 7.17614 7.87418 6.98007C8.14125 6.78424 8.53748 6.646 9 6.646C9.46252 6.646 9.85875 6.78424 10.1258 6.98007C10.3932 7.17614 10.5 7.40049 10.5 7.59585C10.5 7.9065 10.7518 8.15835 11.0625 8.15835C11.3732 8.15835 11.625 7.9065 11.625 7.59585C11.625 6.95594 11.2701 6.42412 10.791 6.07283C10.4474 5.8209 10.024 5.64665 9.5625 5.56812V5.25Z" fill="#A0A0AB"/>
</svg>
                    )
                  },
                  { 
                    key: 'experience', 
                    label: 'Experience',
                    icon: (color: string) => (
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M11.0625 5.01636C11.0625 4.47798 11.0619 4.11637 11.034 3.84082C11.0068 3.57476 10.9587 3.45193 10.9043 3.3706C10.8359 3.26826 10.7481 3.18045 10.6458 3.11206C10.5644 3.05772 10.4416 3.0095 10.1755 2.98242C9.89997 2.95439 9.5384 2.95386 8.99997 2.95386C8.46162 2.95386 8.10005 2.95439 7.8245 2.98242C7.5584 3.0095 7.43557 3.05772 7.35425 3.11206C7.2519 3.18045 7.16409 3.26826 7.0957 3.3706C7.04136 3.45193 6.99314 3.57476 6.96606 3.84082C6.93803 4.11637 6.9375 4.47798 6.9375 5.01636C6.9375 5.32702 6.68566 5.57886 6.375 5.57886C6.06434 5.57886 5.8125 5.32702 5.8125 5.01636C5.8125 4.50148 5.81177 4.07296 5.84693 3.7273C5.88305 3.37223 5.96201 3.04282 6.1604 2.74585C6.31088 2.52064 6.50429 2.32723 6.72949 2.17675C7.02646 1.97836 7.35587 1.8994 7.71095 1.86328C8.05662 1.82813 8.4851 1.82886 8.99997 1.82886C9.51485 1.82886 9.9434 1.82813 10.2891 1.86328C10.6441 1.8994 10.9735 1.97836 11.2705 2.17675C11.4957 2.32723 11.6891 2.52064 11.8396 2.74585C12.038 3.04282 12.117 3.37223 12.153 3.7273C12.1882 4.07296 12.1875 4.50148 12.1875 5.01636C12.1875 5.32702 11.9357 5.57886 11.625 5.57886C11.3143 5.57886 11.0625 5.32702 11.0625 5.01636Z" fill="#A0A0AB"/>
  <path d="M11.2932 4.45386C12.4945 4.45385 13.454 4.45384 14.206 4.55494C14.983 4.65942 15.6231 4.88081 16.1294 5.38697C16.6357 5.89318 16.8576 6.53332 16.9621 7.31031C17.0629 8.05877 17.0631 9.01285 17.0632 10.2063V10.6926C17.0634 11.8899 17.0637 12.8464 16.9629 13.5967C16.8585 14.3739 16.6365 15.0136 16.1301 15.52C15.6237 16.0265 14.984 16.2482 14.2068 16.3528C13.4544 16.454 12.4945 16.4539 11.2925 16.4539H6.70459C5.5044 16.4538 4.54621 16.4538 3.79468 16.3528C3.01749 16.2482 2.37767 16.0264 1.87133 15.52C1.36499 15.0137 1.14306 14.3738 1.03857 13.5967C0.937471 12.8447 0.937478 11.8858 0.937501 10.6846V10.2224C0.937486 9.02147 0.937486 8.0629 1.03857 7.31104C1.14307 6.53386 1.36499 5.89404 1.87133 5.3877C2.37768 4.88135 3.01749 4.65943 3.79468 4.55494C4.54666 4.45384 5.50558 4.45384 6.70679 4.45386H11.2932ZM4.5 7.45386C4.18934 7.45386 3.9375 7.70567 3.9375 8.0164C3.9375 8.32705 4.18934 8.5789 4.5 8.5789H13.5C13.8106 8.57882 14.0625 8.32697 14.0625 8.0164C14.0625 7.70575 13.8106 7.45391 13.5 7.45386H4.5Z" fill="#A0A0AB"/>
</svg>
                    )
                  },
                  { 
                    key: 'skill', 
                    label: 'Skill',
                    icon: (color: string) => (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M12.013 1.74386C12.4066 1.80261 12.8351 1.94474 13.0808 2.37029C13.3258 2.79478 13.2363 3.23713 13.0922 3.60852C12.9536 3.96593 12.7078 4.39825 12.4216 4.90174L11.5958 6.35439C11.4397 6.6291 11.3391 6.80682 11.2751 6.94303C11.227 7.04525 11.2182 7.08713 11.2168 7.09406C11.2192 7.17736 11.2632 7.25255 11.3317 7.29495C11.3391 7.29734 11.3797 7.30987 11.4885 7.31837C11.6375 7.33002 11.8636 7.33043 12.1785 7.33043C12.5451 7.33042 12.8527 7.33041 13.0926 7.34879C13.3245 7.36655 13.5977 7.40597 13.8267 7.5582C14.2713 7.8537 14.5025 8.38118 14.4214 8.90798C14.3797 9.17895 14.2259 9.40755 14.083 9.59198C13.9352 9.78263 13.7284 10.0113 13.4818 10.2841L9.28798 14.9214C8.90331 15.3469 8.57946 15.705 8.31598 15.9347C8.18203 16.0515 8.02371 16.1716 7.84716 16.2432C7.65261 16.3222 7.39595 16.3557 7.14103 16.2229C6.88667 16.0904 6.76715 15.8615 6.71961 15.6581C6.67631 15.4728 6.68259 15.2744 6.70031 15.0972C6.73516 14.7486 6.83959 14.2763 6.96374 13.7148L7.48744 11.3458C7.59133 10.8759 7.65471 10.5827 7.67091 10.3682C7.69318 10.1913 7.53891 10.1154 7.45897 10.0997C7.24783 10.0691 6.95016 10.0677 6.47103 10.0677H6.08398C5.56432 10.0677 5.11195 10.0678 4.76239 10.0157C4.39258 9.9606 3.99668 9.8283 3.74806 9.4437C3.50002 9.06008 3.54054 8.64465 3.64024 8.28405C3.73472 7.94243 3.91828 7.5273 4.12954 7.04958L5.51723 3.91086C5.71266 3.46881 5.87699 3.0971 6.04459 2.80607C6.22221 2.49763 6.42744 2.23535 6.72726 2.03948C7.02727 1.84349 7.34964 1.76126 7.70293 1.72328C8.03593 1.68748 8.44093 1.68749 8.92191 1.6875H10.5627C11.1391 1.68746 11.635 1.68743 12.013 1.74386Z" fill="#A0A0AB"/>
</svg>
                    )
                  },
                  { 
                    key: 'industry', 
                    label: 'Industry',
                    icon: (color: string) => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clip-path="url(#clip0_3286_4493)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.94896 0.937501H6.05104C7.03036 0.937478 7.83788 0.937456 8.47703 1.02455C9.14805 1.11597 9.7407 1.31531 10.2152 1.79621C10.6897 2.27711 10.8864 2.87771 10.9766 3.55777C11.0626 4.20552 11.0625 5.02395 11.0625 6.01646V17.0625H5.94898C4.96965 17.0625 4.1621 17.0626 3.52295 16.9754C2.85193 16.884 2.25931 16.6847 1.7848 16.2038C1.3103 15.7229 1.1136 15.1223 1.02338 14.4422C0.937456 13.7945 0.937478 12.9761 0.937501 11.9836V6.01646C0.937478 5.02395 0.937456 4.20552 1.02338 3.55777C1.1136 2.87771 1.3103 2.27711 1.7848 1.79621C2.25931 1.31531 2.85193 1.11597 3.52295 1.02455C4.1621 0.937456 4.96964 0.937478 5.94896 0.937501ZM3.71568 2.47738C3.20505 2.54696 2.96855 2.66963 2.80758 2.83277C2.64662 2.9959 2.52557 3.23559 2.45692 3.7531C2.38547 4.29169 2.38393 5.01091 2.38393 6.06818V11.9318C2.38393 12.9891 2.38547 13.7084 2.45692 14.2469C2.52557 14.7644 2.64662 15.0041 2.80758 15.1673C2.96855 15.3304 3.20505 15.4531 3.71568 15.5226C4.24712 15.5951 4.95677 15.5966 6 15.5966H9.61605V6.06818C9.61605 5.01091 9.61455 4.29169 9.54308 3.7531C9.47445 3.23559 9.3534 2.9959 9.19245 2.83277C9.03143 2.66963 8.79495 2.54696 8.28435 2.47738C7.7529 2.40497 7.04323 2.40341 6 2.40341C4.95677 2.40341 4.24712 2.40497 3.71568 2.47738Z" fill="#A0A0AB"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.375 5.25C3.375 4.83579 3.71079 4.5 4.125 4.5H4.875C5.28921 4.5 5.625 4.83579 5.625 5.25C5.625 5.66421 5.28921 6 4.875 6H4.125C3.71079 6 3.375 5.66421 3.375 5.25ZM6.375 5.25C6.375 4.83579 6.71079 4.5 7.125 4.5H7.875C8.28922 4.5 8.625 4.83579 8.625 5.25C8.625 5.66421 8.28922 6 7.875 6H7.125C6.71079 6 6.375 5.66421 6.375 5.25ZM3.375 8.25C3.375 7.83578 3.71079 7.5 4.125 7.5H4.875C5.28921 7.5 5.625 7.83578 5.625 8.25C5.625 8.66422 5.28921 9 4.875 9H4.125C3.71079 9 3.375 8.66422 3.375 8.25ZM6.375 8.25C6.375 7.83578 6.71079 7.5 7.125 7.5H7.875C8.28922 7.5 8.625 7.83578 8.625 8.25C8.625 8.66422 8.28922 9 7.875 9H7.125C6.71079 9 6.375 8.66422 6.375 8.25ZM3.375 11.25C3.375 10.8358 3.71079 10.5 4.125 10.5H4.875C5.28921 10.5 5.625 10.8358 5.625 11.25C5.625 11.6642 5.28921 12 4.875 12H4.125C3.71079 12 3.375 11.6642 3.375 11.25ZM6.375 11.25C6.375 10.8358 6.71079 10.5 7.125 10.5H7.875C8.28922 10.5 8.625 10.8358 8.625 11.25C8.625 11.6642 8.28922 12 7.875 12H7.125C6.71079 12 6.375 11.6642 6.375 11.25Z" fill="#A0A0AB"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4584 6.0416C16.1168 5.69999 15.6917 5.56074 15.2209 5.49744C14.7748 5.43746 14.2129 5.43748 13.5391 5.4375H9.9375V17.0625H13.539C14.2129 17.0625 14.7748 17.0626 15.2209 17.0026C15.6917 16.9393 16.1168 16.8 16.4584 16.4584C16.8 16.1168 16.9393 15.6917 17.0026 15.2209C17.0626 14.7748 17.0625 14.2129 17.0625 13.539V8.961C17.0625 8.28713 17.0626 7.72523 17.0026 7.27914C16.9393 6.8083 16.8 6.3832 16.4584 6.0416ZM13.125 7.6875C12.8143 7.6875 12.5625 7.93935 12.5625 8.25C12.5625 8.56065 12.8143 8.8125 13.125 8.8125H13.875C14.1857 8.8125 14.4375 8.56065 14.4375 8.25C14.4375 7.93935 14.1857 7.6875 13.875 7.6875H13.125ZM13.125 10.6875C12.8143 10.6875 12.5625 10.9394 12.5625 11.25C12.5625 11.5607 12.8143 11.8125 13.125 11.8125H13.875C14.1857 11.8125 14.4375 11.5607 14.4375 11.25C14.4375 10.9394 14.1857 10.6875 13.875 10.6875H13.125Z" fill="#A0A0AB"/>
  </g>
  <defs>
    <clipPath id="clip0_3286_4493">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    )
                  }
                ].map(({ key, label, icon }) => {
                  const isActive = activeFilterCategory === key
                  const color = isActive ? '#A48AFB' : '#6B6B76'
                  
                  return (
                    <button
                      key={key}
                      onClick={() => scrollToSection(key)}
                      className="flex justify-between font-bo h-[40px] mb-[2px] items-center gap-2 py-[8px] px-[12px] transition-all"
                      style={{
                        borderRadius: '2px',
                        borderLeft: isActive ? '2px solid #875BF7' : '2px solid transparent'
                      }}
                    >
                     <div className='flex gap-2 items-center'>
                       <div 
                        className="flex items-center justify-center w-[18px] rounded-lg transition-all"
                       
                      >
                        {icon(color)}
                      </div>
                      <span 
                        style={{ 
                          overflow: 'hidden',
                          color: isActive ? '#A48AFB' : color,
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--font-body, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px'
                        }}
                      >
                        {label}
                      </span>
                     </div>
                     {isActive && (
                       <div
                         style={{
                           borderRadius: '9999px',
                           background: '#875BF7',
                           width: '4px',
                           height: '4px',
                           aspectRatio: '1/1'
                         }}
                       />
                     )}
                    </button>
                  )
                })}
              </div>

              {/* Right Scrollable Content */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="filter-modal-scroll flex-1 overflow-y-auto p-[16px] space-y-8 bg-[#1a1a1e]"
              >
                {/* Location Section */}
                <div ref={locationRef} className=" bg-[#131316] p-[20px] rounded-[16px] font-body">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3
                        style={{ fontFamily: 'var(--font-body)' }}
                        className="text-[16px] font-medium text-white">Location</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          
                             <div className="flex items-center justify-between mb-2">
                           <label className='block text-[12px] text-[#70707B] '>Preferred location</label>
                            {preferredLocationTags.length > 0 && (
                              <button 
                                onClick={() => setPreferredLocationTags([])}
                                className="text-[12px] text-[#4b426f] hover:text-[#A48AFB] transition-colors"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          <div className="relative mb-2">
                            <Input
                              value={preferredLocation}
                              onChange={(e) => setPreferredLocation(e.target.value)}
                              placeholder="eg. Chennai, Tamil Nadu, India"
                              className="w-full rounded-[12px] border-[0.5px]"
                              style={{
                                display: 'flex',
                                padding: '10px 14px',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '12px',
                                border: '0.5px solid #26272B',
                                background: '#1A1A1E',
                                boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                overflow: 'hidden',
                                color: '#70707B',
                                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                textOverflow: 'ellipsis',
                                fontFamily: 'var(--font-body)',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '24px'
                              }}
                            />
                           <svg
                           className='absolute right-3 top-1/2 -translate-y-1/2'
                           xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
</svg>
                          </div>
                              
                          {preferredLocationTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {preferredLocationTags.map((tag, index) => (
                                <div
                                  key={index}
                                  className="flex items-center rounded-[6px] font-body"
                                  style={{
                                    display: 'flex',
                                    height: '24px',
                                    padding: '2px 4px 2px 8px',
                                    alignItems: 'center',
                                    gap: '2px',
                                    background: '#231241'
                                  }}
                                >
                                  <span
                                    style={{
                                      overflow: 'hidden',
                                      color: '#c3b4fd',
                                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                      textOverflow: 'ellipsis',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '14px',
                                      fontStyle: 'normal',
                                      fontWeight: 500,
                                      lineHeight: '20px'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                  <button
                                    onClick={() => setPreferredLocationTags(preferredLocationTags.filter((_, i) => i !== index))}
                                    className="hover:opacity-70 transition-opacity"
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M9 3L3.00041 8.9996M8.9996 9L3 3.00043" stroke="#C3B4FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-[12px] text-[#70707B]">Post location</label>
                            {postLocationTags.length > 0 && (
                              <button 
                                onClick={() => setPostLocationTags([])}
                                className="text-[12px] text-[#875BF7] hover:text-[#A48AFB] transition-colors"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          {postLocationTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {postLocationTags.map((tag, index) => (
                                <div
                                  key={index}
                                  className="flex items-center rounded-full"
                                  style={{
                                    display: 'flex',
                                    height: '24px',
                                    padding: '2px 4px 2px 8px',
                                    alignItems: 'center',
                                    gap: '2px',
                                    background: '#875BF7'
                                  }}
                                >
                                  <span
                                    style={{
                                      overflow: 'hidden',
                                      color: '#C3B4FD',
                                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                      textOverflow: 'ellipsis',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '14px',
                                      fontStyle: 'normal',
                                      fontWeight: 500,
                                      lineHeight: '20px'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                  <button
                                    onClick={() => setPostLocationTags(postLocationTags.filter((_, i) => i !== index))}
                                    className="hover:opacity-70 transition-opacity"
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M9 3L3.00041 8.9996M8.9996 9L3 3.00043" stroke="#C3B4FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="relative">
                              <Input
                              value={postLocation}
                              onChange={(e) => setPostLocation(e.target.value)}
                              placeholder="eg. Chennai, Tamil Nadu, India"
                              className="w-full rounded-[12px] border-[0.5px]"
                              style={{
                                display: 'flex',
                                padding: '10px 14px',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '12px',
                                border: '0.5px solid #26272B',
                                background: '#1A1A1E',
                                boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                overflow: 'hidden',
                                color: '#70707B',
                                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                textOverflow: 'ellipsis',
                                fontFamily: 'var(--font-body)',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '24px'
                              }}
                            />
                              <svg
                           className='absolute right-3 top-1/2 -translate-y-1/2'
                           xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
</svg>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2 pr-2">
                        <label className="block text-[12px] text-[#70707B] mb-2">Availability</label>
                        <div className="relative">
                          <div
                            onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                            onBlur={() => setTimeout(() => setShowAvailabilityDropdown(false), 200)}
                            tabIndex={0}
                            className="w-full rounded-[12px] border-[0.5px] cursor-pointer transition-colors"
                            style={{
                              display: 'flex',
                              padding: '10px 14px',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              borderRadius: '12px',
                              border: showAvailabilityDropdown ? '0.5px solid #875BF7' : '0.5px solid #26272B',
                              background: '#1A1A1E',
                              boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                              color: availability ? '#FFF' : '#70707B',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              fontFamily: 'var(--font-body)',
                              fontSize: '16px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '24px'
                            }}
                          >
                            <span>{availability || 'Select'}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showAvailabilityDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {showAvailabilityDropdown && (
                            <div 
                              className="filter-modal-scroll absolute w-full mt-2 rounded-xl overflow-hidden z-20 max-h-60 overflow-y-auto"
                              style={{ 
                                backgroundColor: '#131318', 
                                boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                padding: '12px 0'
                              }}
                            >
                              {['Immediate', 'Within 1 month', 'Within 2 months'].map(option => (
                                <div
                                  key={option}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setAvailability(option)
                                    setShowAvailabilityDropdown(false)
                                  }}
                                  className="px-6 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
                                  style={{ color: '#FFFFFF', fontSize: '16px' }}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Section */}
                <div ref={salaryRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-[16px] font-medium text-white mb-4">Salary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] text-[#70707B] mb-2">Min salary (LPA)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70707B]">₹</span>
                              <Input
                              value={minSalary}
                              onChange={(e) => setMinSalary(e.target.value)}
                              placeholder="eg. 10"
                              className="w-full rounded-[12px] border-[0.5px]"
                              style={{
                                display: 'flex',
                                padding: '10px 14px 10px 32px',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '12px',
                                border: '0.5px solid #26272B',
                                background: '#1A1A1E',
                                boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                overflow: 'hidden',
                                color: '#70707B',
                                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                textOverflow: 'ellipsis',
                                fontFamily: 'var(--font-body)',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '24px'
                              }}
                            />
                            <svg
                              className='absolute right-3 top-1/2 -translate-y-1/2'
                              xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] text-[#70707B] mb-2">Max salary (LPA)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70707B]">₹</span>
                              <Input
                              value={maxSalary}
                              onChange={(e) => setMaxSalary(e.target.value)}
                              placeholder="eg. 20"
                              className="w-full rounded-[12px] border-[0.5px]"
                              style={{
                                display: 'flex',
                                padding: '10px 14px 10px 32px',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '12px',
                                border: '0.5px solid #26272B',
                                background: '#1A1A1E',
                                boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                overflow: 'hidden',
                                color: '#70707B',
                                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                textOverflow: 'ellipsis',
                                fontFamily: 'var(--font-body)',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '24px'
                              }}
                            />
                            <svg
                              className='absolute right-3 top-1/2 -translate-y-1/2'
                              xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                {/* Experience Section */}
                <div ref={experienceRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-[16px] font-medium text-white mb-4">Experience</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] text-[#70707B] mb-2">Min experience (Years)</label>
                          <div className="relative">
                            <Input
                            value={minExperience}
                            onChange={(e) => setMinExperience(e.target.value)}
                            placeholder="eg. 2"
                            className="w-full rounded-[12px] border-[0.5px]"
                            style={{
                              display: 'flex',
                              padding: '10px 14px',
                              alignItems: 'center',
                              gap: '8px',
                              borderRadius: '12px',
                              border: '0.5px solid #26272B',
                              background: '#1A1A1E',
                              boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                              overflow: 'hidden',
                              color: '#70707B',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: 'var(--font-body)',
                              fontSize: '16px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '24px'
                            }}
                          />
                          <svg
                            className='absolute right-3 top-1/2 -translate-y-1/2'
                            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                          </svg>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] text-[#70707B] mb-2">Max experience (Years)</label>
                          <div className="relative">
                            <Input
                            value={maxExperience}
                            onChange={(e) => setMaxExperience(e.target.value)}
                            placeholder="eg. 4"
                            className="w-full rounded-[12px] border-[0.5px]"
                            style={{
                              display: 'flex',
                              padding: '10px 14px',
                              alignItems: 'center',
                              gap: '8px',
                              borderRadius: '12px',
                              border: '0.5px solid #26272B',
                              background: '#1A1A1E',
                              boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                              overflow: 'hidden',
                              color: '#70707B',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: 'var(--font-body)',
                              fontSize: '16px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '24px'
                            }}
                          />
                          <svg
                            className='absolute right-3 top-1/2 -translate-y-1/2'
                            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                          </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                {/* Skill Section */}
                <div ref={skillRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-[16px] font-medium text-white">Skill</h3>
                        <button className="text-[12px] text-[#875BF7]">Clear all</button>
                      </div>
                      <label className="block text-[12px] text-[#70707B] mb-2">Add skills</label>
                      <div className="relative">
                          <Input
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="Search for skills"
                          className="w-1/2 rounded-[12px] border-[0.5px]"
                          style={{
                            display: 'flex',
                            padding: '10px 14px',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '12px',
                            border: '0.5px solid #26272B',
                            background: '#1A1A1E',
                            boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                            overflow: 'hidden',
                            color: '#70707B',
                            fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                            textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-body)',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '24px'
                          }}
                        />
                        <svg
                          className='absolute w-1/2 left-32 top-1/2 -translate-y-1/2'
                          xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                        </svg>
                       
                      </div>
                    </div>
                </div>

                {/* Industry Section */}
                <div ref={industryRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-[16px] font-medium text-white mb-4">Industry</h3>
                    <div className="relative">
                      <div
                        onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                        onBlur={() => setTimeout(() => setShowIndustryDropdown(false), 200)}
                        tabIndex={0}
                        className="w-1/2 rounded-[12px] border-[0.5px] cursor-pointer transition-colors"
                        style={{
                          display: 'flex',
                          padding: '10px 14px',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          borderRadius: '12px',
                          border: showIndustryDropdown ? '0.5px solid #875BF7' : '0.5px solid #26272B',
                          background: '#1A1A1E',
                          boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                          color: industry ? '#FFF' : '#70707B',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: 'var(--font-body)',
                          fontSize: '16px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '24px'
                        }}
                      >
                        <span>{industry || 'Select industry'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showIndustryDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {showIndustryDropdown && (
                        <div 
                          className="filter-modal-scroll absolute w-full mt-2 rounded-xl overflow-hidden z-20 max-h-60 overflow-y-auto"
                          style={{ 
                            backgroundColor: '#131318', 
                            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '12px 0'
                          }}
                        >
                          {['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Consulting'].map(option => (
                            <div
                              key={option}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setIndustry(option)
                                setShowIndustryDropdown(false)
                              }}
                              className="px-6 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
                              style={{ color: '#FFFFFF', fontSize: '16px' }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload JD Modal */}
      <UploadJDModal 
        isOpen={showUploadJDModal} 
        onClose={() => setShowUploadJDModal(false)} 
      />
    </div>
  )
}