import Link from 'next/link';
import './SignInAd.css';
import { FaTrophy, FaGamepad } from 'react-icons/fa';

function SignInAd({title = "سجل دخولك للمشاركة!", message = "العب مباريات واحصل على جوائز"}) {
    return (
        <div className="signin-ad">
            <div className="signin-ad-content">
                <div className="signin-icons">
                    <FaGamepad className="feature-icon" />
                    <FaTrophy className="feature-icon" />
                </div>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="cta-container">
                    <Link href="/Auth" className="signin-button">
                        تسجيل الدخول
                    </Link>
                    <Link href="/Prize_rules" className="rules-link">
                        تعرف على الجوائز
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignInAd;
