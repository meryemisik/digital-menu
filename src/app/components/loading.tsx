import Image from "next/image";
import loadingFork from '../../asset/images/loading-fork.svg'
import loadingSpoon from '../../asset/images/loading-spoon.svg'
import '@/asset/scss/loading.scss'
const Loading = () => {
    return <>
        <div className="loading">
            <div className="loading-circle">
            <Image alt="fork"
                src={loadingFork}
            />
             <Image
             alt="spoon"
                src={loadingSpoon}
            />
            </div>
           
        </div></>;
};
export default Loading;