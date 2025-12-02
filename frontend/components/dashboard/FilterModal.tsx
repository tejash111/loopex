'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [activeFilterCategory, setActiveFilterCategory] = useState('location')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const salaryRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const skillRef = useRef<HTMLDivElement>(null)
  const industryRef = useRef<HTMLDivElement>(null)

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

  if (!isOpen) return null

  // Handle scroll to update active section
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const scrollContainer = scrollContainerRef.current
    const scrollTop = scrollContainer.scrollTop
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
    const scrollPercentage = (scrollTop / scrollHeight) * 100

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

  const filterCategories = [
    { 
      key: 'location', 
      label: 'Location',
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M5.98169 13.1477C6.07265 13.5518 5.8188 13.9532 5.4147 14.0441C4.76411 14.1905 4.28262 14.3659 3.98305 14.5373C3.92309 14.5716 3.87677 14.6018 3.84119 14.6274C3.85469 14.6372 3.86968 14.6475 3.88633 14.6586C4.09787 14.799 4.45346 14.9546 4.96011 15.0969C5.963 15.3785 7.39158 15.5624 9 15.5624C10.6084 15.5624 12.037 15.3785 13.0399 15.0969C13.5466 14.9546 13.9021 14.799 14.1136 14.6586C14.1303 14.6476 14.1453 14.6372 14.1588 14.6274C14.1233 14.6018 14.0769 14.5716 14.017 14.5373C13.7174 14.3659 13.2359 14.1905 12.5853 14.0441C12.1812 13.9532 11.9273 13.5518 12.0183 13.1477C12.1093 12.7436 12.5106 12.4898 12.9147 12.5807C13.6358 12.743 14.2793 12.9593 14.7618 13.2353C15.1906 13.4807 15.75 13.9252 15.75 14.6276C15.75 15.2471 15.3102 15.6647 14.9433 15.9083C14.5476 16.171 14.0246 16.3784 13.4454 16.541C12.2767 16.8692 10.7053 17.0624 9 17.0624C7.29472 17.0624 5.72329 16.8692 4.55461 16.541C3.97547 16.3784 3.45238 16.171 3.05669 15.9083C2.68983 15.6647 2.25 15.2471 2.25 14.6276C2.25 13.9252 2.80934 13.4807 3.23819 13.2353C3.72069 12.9593 4.3642 12.743 5.0853 12.5807C5.48941 12.4898 5.89073 12.7436 5.98169 13.1477Z" fill="#A48AFB"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M9.00037 0.9375C6.71224 0.9375 4.53906 2.3287 3.63118 4.5118C2.78598 6.54422 3.24547 8.27625 4.19455 9.75173C4.96915 10.9559 6.09934 12.0308 7.10766 12.9898C7.29928 13.1721 7.48649 13.3501 7.66605 13.5241L7.66725 13.5254C8.02522 13.8701 8.50327 14.0625 9.00037 14.0625C9.49747 14.0625 9.9756 13.8701 10.3336 13.5253C10.5031 13.3619 10.6794 13.1949 10.8596 13.0241L10.8604 13.0234C11.8795 12.0577 13.0252 10.9719 13.8079 9.7524C14.7559 8.2755 15.2137 6.54171 14.3696 4.5118C13.4617 2.3287 11.2885 0.9375 9.00037 0.9375ZM9 4.5C7.75732 4.5 6.75 5.50736 6.75 6.75C6.75 7.99268 7.75732 9 9 9C10.2427 9 11.25 7.99268 11.25 6.75C11.25 5.50736 10.2427 4.5 9 4.5Z" fill="#A48AFB"/>
        </svg>
      )
    },
    { 
      key: 'salary', 
      label: 'Salary',
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.7682 1.42892C11.8097 1.31249 10.592 1.31249 9.03848 1.3125H8.96152C7.40798 1.31249 6.19032 1.31249 5.23184 1.42892C4.25236 1.5479 3.46842 1.79558 2.82425 2.34575C2.65247 2.49248 2.49248 2.65247 2.34575 2.82425C1.79558 3.46842 1.5479 4.25236 1.42892 5.23184C1.31249 6.19032 1.31249 7.40798 1.3125 8.96152V9.03848C1.31249 10.592 1.31249 11.8097 1.42892 12.7682C1.5479 13.7477 1.79558 14.5316 2.34575 15.1757C2.49248 15.3476 2.65247 15.5075 2.82425 15.6542C3.46842 16.2044 4.25236 16.4521 5.23184 16.5711C6.19032 16.6875 7.40798 16.6875 8.96152 16.6875H9.03848C10.592 16.6875 11.8097 16.6875 12.7682 16.5711C13.7477 16.4521 14.5316 16.2044 15.1757 15.6542C15.3476 15.5075 15.5075 15.3476 15.6542 15.1757C16.2044 14.5316 16.4521 13.7477 16.5711 12.7682C16.6875 11.8097 16.6875 10.592 16.6875 9.03848V8.96152C16.6875 7.40798 16.6875 6.19032 16.5711 5.23184C16.4521 4.25236 16.2044 3.46842 15.6542 2.82425C15.5075 2.65247 15.3476 2.49248 15.1757 2.34575C14.5316 1.79558 13.7477 1.5479 12.7682 1.42892ZM9.5625 5.25C9.5625 4.93934 9.31065 4.6875 9 4.6875C8.68935 4.6875 8.4375 4.93934 8.4375 5.25V5.56812C7.97603 5.64665 7.55258 5.8209 7.20897 6.07283C6.72989 6.42412 6.375 6.95595 6.375 7.59585C6.375 8.15873 6.57702 8.679 7.09333 9.0246C7.56143 9.33802 8.21415 9.45465 9 9.45465C9.71865 9.45465 10.1459 9.56258 10.3816 9.71528C10.566 9.83483 10.6875 10.0155 10.6875 10.4044C10.6875 10.7313 10.5533 10.9331 10.3027 11.0828C10.0179 11.2528 9.5706 11.3543 9 11.3543C8.47515 11.3543 8.0253 11.2103 7.72283 11.007C7.4168 10.8013 7.3125 10.5777 7.3125 10.4044C7.3125 10.0938 7.06066 9.84195 6.75 9.84195C6.43934 9.84195 6.1875 10.0938 6.1875 10.4044C6.1875 11.0665 6.58688 11.599 7.09522 11.9407C7.47067 12.193 7.93395 12.365 8.4375 12.4387V12.75C8.4375 13.0607 8.68935 13.3125 9 13.3125C9.31065 13.3125 9.5625 13.0607 9.5625 12.75V12.4504C10.04 12.3994 10.4981 12.2763 10.8793 12.0488C11.443 11.7122 11.8125 11.1579 11.8125 10.4044C11.8125 9.71325 11.559 9.13777 10.9934 8.77117C10.4791 8.4378 9.78135 8.32965 9 8.32965C8.28585 8.32965 7.90733 8.21572 7.71915 8.0898C7.5792 7.99612 7.5 7.86817 7.5 7.59585C7.5 7.40049 7.6068 7.17614 7.87418 6.98007C8.14125 6.78424 8.53748 6.646 9 6.646C9.46252 6.646 9.85875 6.78424 10.1258 6.98007C10.3932 7.17614 10.5 7.40049 10.5 7.59585C10.5 7.9065 10.7518 8.15835 11.0625 8.15835C11.3732 8.15835 11.625 7.9065 11.625 7.59585C11.625 6.95594 11.2701 6.42412 10.791 6.07283C10.4474 5.8209 10.024 5.64665 9.5625 5.56812V5.25Z" fill="#A0A0AB"/>
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
          <g clipPath="url(#clip0_3286_4493)">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.94896 0.937501H6.05104C7.03036 0.937478 7.83788 0.937456 8.47703 1.02455C9.14805 1.11597 9.7407 1.31531 10.2152 1.79621C10.6897 2.27711 10.8864 2.87771 10.9766 3.55777C11.0626 4.20552 11.0625 5.02395 11.0625 6.01646V17.0625H5.94898C4.96965 17.0625 4.1621 17.0626 3.52295 16.9754C2.85193 16.884 2.25931 16.6847 1.7848 16.2038C1.3103 15.7229 1.1136 15.1223 1.02338 14.4422C0.937456 13.7945 0.937478 12.9761 0.937501 11.9836V6.01646C0.937478 5.02395 0.937456 4.20552 1.02338 3.55777C1.1136 2.87771 1.3103 2.27711 1.7848 1.79621C2.25931 1.31531 2.85193 1.11597 3.52295 1.02455C4.1621 0.937456 4.96964 0.937478 5.94896 0.937501ZM3.71568 2.47738C3.20505 2.54696 2.96855 2.66963 2.80758 2.83277C2.64662 2.9959 2.52557 3.23559 2.45692 3.7531C2.38547 4.29169 2.38393 5.01091 2.38393 6.06818V11.9318C2.38393 12.9891 2.38547 13.7084 2.45692 14.2469C2.52557 14.7644 2.64662 15.0041 2.80758 15.1673C2.96855 15.3304 3.20505 15.4531 3.71568 15.5226C4.24712 15.5951 4.95677 15.5966 6 15.5966H9.61605V6.06818C9.61605 5.01091 9.61455 4.29169 9.54308 3.7531C9.47445 3.23559 9.3534 2.9959 9.19245 2.83277C9.03143 2.66963 8.79495 2.54696 8.28435 2.47738C7.7529 2.40497 7.04323 2.40341 6 2.40341C4.95677 2.40341 4.24712 2.40497 3.71568 2.47738Z" fill="#A0A0AB"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.375 5.25C3.375 4.83579 3.71079 4.5 4.125 4.5H4.875C5.28921 4.5 5.625 4.83579 5.625 5.25C5.625 5.66421 5.28921 6 4.875 6H4.125C3.71079 6 3.375 5.66421 3.375 5.25ZM6.375 5.25C6.375 4.83579 6.71079 4.5 7.125 4.5H7.875C8.28922 4.5 8.625 4.83579 8.625 5.25C8.625 5.66421 8.28922 6 7.875 6H7.125C6.71079 6 6.375 5.66421 6.375 5.25ZM3.375 8.25C3.375 7.83578 3.71079 7.5 4.125 7.5H4.875C5.28921 7.5 5.625 7.83578 5.625 8.25C5.625 8.66422 5.28921 9 4.875 9H4.125C3.71079 9 3.375 8.66422 3.375 8.25ZM6.375 8.25C6.375 7.83578 6.71079 7.5 7.125 7.5H7.875C8.28922 7.5 8.625 7.83578 8.625 8.25C8.625 8.66422 8.28922 9 7.875 9H7.125C6.71079 9 6.375 8.66422 6.375 8.25ZM3.375 11.25C3.375 10.8358 3.71079 10.5 4.125 10.5H4.875C5.28921 10.5 5.625 10.8358 5.625 11.25C5.625 11.6642 5.28921 12 4.875 12H4.125C3.71079 12 3.375 11.6642 3.375 11.25ZM6.375 11.25C6.375 10.8358 6.71079 10.5 7.125 10.5H7.875C8.28922 10.5 8.625 10.8358 8.625 11.25C8.625 11.6642 8.28922 12 7.875 12H7.125C6.71079 12 6.375 11.6642 6.375 11.25Z" fill="#A0A0AB"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16.4584 6.0416C16.1168 5.69999 15.6917 5.56074 15.2209 5.49744C14.7748 5.43746 14.2129 5.43748 13.5391 5.4375H9.9375V17.0625H13.539C14.2129 17.0625 14.7748 17.0626 15.2209 17.0026C15.6917 16.9393 16.1168 16.8 16.4584 16.4584C16.8 16.1168 16.9393 15.6917 17.0026 15.2209C17.0626 14.7748 17.0625 14.2129 17.0625 13.539V8.961C17.0625 8.28713 17.0626 7.72523 17.0026 7.27914C16.9393 6.8083 16.8 6.3832 16.4584 6.0416ZM13.125 7.6875C12.8143 7.6875 12.5625 7.93935 12.5625 8.25C12.5625 8.56065 12.8143 8.8125 13.125 8.8125H13.875C14.1857 8.8125 14.4375 8.56065 14.4375 8.25C14.4375 7.93935 14.1857 7.6875 13.875 7.6875H13.125ZM13.125 10.6875C12.8143 10.6875 12.5625 10.9394 12.5625 11.25C12.5625 11.5607 12.8143 11.8125 13.125 11.8125H13.875C14.1857 11.8125 14.4375 11.5607 14.4375 11.25C14.4375 10.9394 14.1857 10.6875 13.875 10.6875H13.125Z" fill="#A0A0AB"/>
          </g>
          <defs>
            <clipPath id="clip0_3286_4493">
              <rect width="18" height="18" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      )
    }
  ]

  return (
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
          <Button
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-[14px] font-medium text-white transition"
            style={{ backgroundColor: '#875BF7' }}
          >
            Show results
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div 
            className="flex flex-col px-[16px] pb-[16px] pt-[6px] w-[220px]"
            style={{
              background: '#1a1a1e',
              borderRight: '0.5px solid #26272b'
            }}
          >
            {filterCategories.map(({ key, label, icon }) => {
              const isActive = activeFilterCategory === key
              const color = isActive ? '#A48AFB' : '#6B6B76'
              
              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="flex justify-between font-body h-[40px] mb-[2px] items-center gap-2 py-[8px] px-[12px] transition-all"
                  style={{
                    borderRadius: '2px',
                    borderLeft: isActive ? '2px solid #875BF7' : '2px solid transparent'
                  }}
                >
                  <div className='flex gap-2 items-center'>
                    <div className="flex items-center justify-center w-[18px] rounded-lg transition-all">
                      {icon(color)}
                    </div>
                    <span 
                      style={{ 
                        overflow: 'hidden',
                        color: isActive ? '#A48AFB' : color,
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-body)',
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

          {/* Scrollable Content */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="filter-modal-scroll flex-1 overflow-y-auto p-[16px] space-y-8 bg-[#1a1a1e]"
          >
            {/* Location Section */}
            <div ref={locationRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <h3 className="text-[16px] font-medium text-white mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Location
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className='block text-[12px] text-[#70707B]'>Preferred location</label>
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
                        padding: '10px 14px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E',
                        color: '#70707B',
                        fontSize: '16px'
                      }}
                    />
                    <svg
                      className='absolute right-3 top-1/2 -translate-y-1/2'
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                    </svg>
                  </div>
                  {preferredLocationTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {preferredLocationTags.map((tag, index) => (
                        <div key={index} className="flex items-center rounded-[6px] px-2 py-1 bg-[#231241]">
                          <span className="text-[14px] text-[#c3b4fd]">{tag}</span>
                          <button onClick={() => setPreferredLocationTags(preferredLocationTags.filter((_, i) => i !== index))}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M9 3L3.00041 8.9996M8.9996 9L3 3.00043" stroke="#C3B4FD" strokeWidth="1.5"/>
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
                      <button onClick={() => setPostLocationTags([])} className="text-[12px] text-[#875BF7]">
                        Clear all
                      </button>
                    )}
                  </div>
                  {postLocationTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {postLocationTags.map((tag, index) => (
                        <div key={index} className="flex items-center rounded-full px-2 py-1 bg-[#875BF7]">
                          <span className="text-[14px] text-[#C3B4FD]">{tag}</span>
                          <button onClick={() => setPostLocationTags(postLocationTags.filter((_, i) => i !== index))}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M9 3L3.00041 8.9996M8.9996 9L3 3.00043" stroke="#C3B4FD" strokeWidth="1.5"/>
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
                      className="w-full rounded-[12px]"
                      style={{
                        padding: '10px 14px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E',
                        color: '#70707B',
                        fontSize: '16px'
                      }}
                    />
                    <svg className='absolute right-3 top-1/2 -translate-y-1/2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                    className="w-full rounded-[12px] cursor-pointer p-3"
                    style={{
                      border: showAvailabilityDropdown ? '0.5px solid #875BF7' : '0.5px solid #26272B',
                      background: '#1A1A1E',
                      color: availability ? '#FFF' : '#70707B'
                    }}
                  >
                    {availability || 'Select'}
                  </div>
                  {showAvailabilityDropdown && (
                    <div className="absolute w-full mt-2 rounded-xl bg-[#131318] z-20 p-3">
                      {['Immediate', 'Within 1 month', 'Within 2 months'].map(option => (
                        <div
                          key={option}
                          onClick={() => {
                            setAvailability(option)
                            setShowAvailabilityDropdown(false)
                          }}
                          className="px-4 py-2 cursor-pointer text-white hover:bg-[#1f1f26]"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Section */}
            <div ref={salaryRef} className="bg-[#131316] p-[20px] rounded-[16px]">
              <h3 className="text-[16px] font-medium text-white mb-4">Salary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-[#70707B] mb-2">Min salary (LPA)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70707B]">₹</span>
                    <Input
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="eg. 10"
                      className="pl-8"
                      style={{ background: '#1A1A1E', border: '0.5px solid #26272B' }}
                    />
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
                      className="pl-8"
                      style={{ background: '#1A1A1E', border: '0.5px solid #26272B' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div ref={experienceRef} className="bg-[#131316] p-[20px] rounded-[16px]">
              <h3 className="text-[16px] font-medium text-white mb-4">Experience</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-[#70707B] mb-2">Min experience (Years)</label>
                  <Input
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    placeholder="eg. 2"
                    style={{ background: '#1A1A1E', border: '0.5px solid #26272B' }}
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#70707B] mb-2">Max experience (Years)</label>
                  <Input
                    value={maxExperience}
                    onChange={(e) => setMaxExperience(e.target.value)}
                    placeholder="eg. 4"
                    style={{ background: '#1A1A1E', border: '0.5px solid #26272B' }}
                  />
                </div>
              </div>
            </div>

            {/* Skill Section */}
            <div ref={skillRef} className="bg-[#131316] p-[20px] rounded-[16px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-medium text-white">Skill</h3>
                <button className="text-[12px] text-[#875BF7]">Clear all</button>
              </div>
              <label className="block text-[12px] text-[#70707B] mb-2">Add skills</label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Search for skills"
                className="w-1/2"
                style={{ background: '#1A1A1E', border: '0.5px solid #26272B' }}
              />
            </div>

            {/* Industry Section */}
            <div ref={industryRef} className="bg-[#131316] p-[20px] rounded-[16px]">
              <h3 className="text-[16px] font-medium text-white mb-4">Industry</h3>
              <div className="relative">
                <div
                  onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                  className="w-1/2 rounded-[12px] cursor-pointer p-3"
                  style={{
                    border: showIndustryDropdown ? '0.5px solid #875BF7' : '0.5px solid #26272B',
                    background: '#1A1A1E',
                    color: industry ? '#FFF' : '#70707B'
                  }}
                >
                  {industry || 'Select industry'}
                </div>
                {showIndustryDropdown && (
                  <div className="absolute w-1/2 mt-2 rounded-xl bg-[#131318] z-20 p-3">
                    {['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Consulting'].map(option => (
                      <div
                        key={option}
                        onClick={() => {
                          setIndustry(option)
                          setShowIndustryDropdown(false)
                        }}
                        className="px-4 py-2 cursor-pointer text-white hover:bg-[#1f1f26]"
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
  )
}
