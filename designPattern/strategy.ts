
const form: HTMLElement | null = document.getElementById('form');

interface RuleType {
    min?: number;
    max?: number;
    message?: string;
    required?: boolean;
    validator?: (rule: RuleType, value: any) => boolean;

    [propName: string]: any
}

interface RulesObType {
    [propName: string]: RuleType
}


class Validator<T> {
    cache: Array<() => any> = [];

    static Rules = {
        'min': (value: string, ruleValue: number): boolean => {
            console.log(value.length, ruleValue);
            return value.length >= ruleValue;
        },
        'max': (value: string, ruleValue: number): boolean => {
            return value.length < ruleValue;
        },
        'isEmail': (value: string, ruleValue: boolean): boolean => {
            if (ruleValue) {
                return /^\[A-Za-z0-9.\_%-\]+@(\[A-Za-z0-9-\]+\\.)+\[A-Za-z\]{2,4}$/.test(value);
            }
            return true;
        },
        'isMobile': (value: string, ruleValue: boolean): boolean => {
            if (ruleValue) {
                return /^1[3456789]\d{9}$/.test(value);
            }
            return true;
        },
        'required': (value: string, ruleValue: boolean): boolean => {
            if (ruleValue) return value !== '';
            return true;
        }
    };

    constructor(values: T, rulesOb: RulesObType) {
        for (let i in values) {
            const v = values[i];
            const rules = rulesOb[i];
            if (!rules) return; // 规则中没有当前项的校验
            if (!Array.isArray(rules)) throw `rules Array<object>`; //
            rules.forEach(rule => {
                this.addValid(v, rule);
            })
        }
    }


    addValid(value: any, rule: RuleType) {
        const rulesKeyArr: string[] = Object.keys(Validator.Rules) || [];
        this.cache.push(() => {
            // 自定义的校验规则
            if (rule.validator) {
                const res = rule.validator(rule, value);
                if (!res) alert(rule.message);
                return res;
            }
            rulesKeyArr.forEach((key) => { // 当前规则有Validator内置的校验规则
                if (rule.hasOwnProperty(key)) {
                    const ruleValue = rule[key];
                    const { message } = rule;

                    // @ts-ignore
                    const res = Validator.Rules[key](value, ruleValue);
                    console.log(res, message);
                    if (!res) alert(message);
                    return res;
                }
            })
        });
    }

    startValid() {
        while (this.cache.length) {
            const fn = this.cache.shift();
            fn && fn();
        }
    }
}


(form as HTMLElement).onsubmit = function (e) {
    const {
        company,
        username,
        password,
        telephone,
    } = this;

    const validate = new Validator({
        company: company.value,
        username: username.value,
        password: password.value,
        telephone: telephone.value,
    }, {
        company: [
            {
                validator (rule: RuleType, value: string) {
                    return value !== '';
                },
                message: '自定义校验规则没通过'
            }
        ],
        username: [
            {
                required: true,
                message: '用户名不能为空'
            }
        ],
        password: [
            {
                required: true,
                message: '密码不能为空'
            },
            {
                min: 6,
                message: '密码长度大于6'
            }
        ],
        telephone: [
            {
                required: true,
                message: '请输入11位的手机号码'
            },
            {
                isMobile: true,
                message: '请输入正确格式的手机号码'
            }
        ]
    });

    validate.startValid();

    return false;
};
