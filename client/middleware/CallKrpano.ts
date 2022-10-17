import useKrpano from 'react-krpano-hooks'

interface krapnoProps {
    containerRef : any
    getKrpano : any
    setKrpano : any
    callKrpano : any
}


export const _krapno : krapnoProps = {
    containerRef : null,
    getKrpano : null,
    setKrpano : null,
    callKrpano : null
};

interface Params {
    xml : string,
    target : string,
    html : string
}

interface myProps {
    scriptPath : string | undefined
    embeddingParams : Params | undefined
    // next : (res : any) => void
    _handleLoaded ?: any
}

export const callKrpano = ({scriptPath, embeddingParams, _handleLoaded}:myProps) => {
    // const loadHandler = (resolve : any, _handleLoaded : any, containerRef: any, setKrpano : any, getKrpano: any) => {
    //     _handleLoaded()
    //     const result = {containerRef, getKrpano, setKrpano}
    //     _krapno.containerRef = containerRef
    //     _krapno.getKrpano = getKrpano
    //     _krapno.setKrpano = setKrpano
    //     resolve(result)
    // }
    const p = new Promise(
        (resolve, reject) => {
            const {containerRef, krpanoState, getKrpano, setKrpano, callKrpano}  = useKrpano({
                scriptPath,
                embeddingParams,
                handleLoaded : () => {
                    _handleLoaded()
                }
            })
            if (krpanoState.error) reject(krpanoState.error)
            const result = {containerRef, getKrpano, setKrpano, callKrpano}
            _krapno.containerRef = containerRef
            _krapno.getKrpano = getKrpano
            _krapno.setKrpano = setKrpano
            _krapno.callKrpano = callKrpano
            resolve(result)
        }
    )
    return p
}